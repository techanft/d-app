import { CButton, CCard, CCardBody, CCol, CCollapse, CContainer, CDataTable, CLink, CRow } from "@coreui/react";
import { faArrowAltCircleDown, faArrowAltCircleUp, faClipboard, faDonate, faEdit, faIdBadge } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import dayjs from "dayjs";
import { BigNumber, ethers } from "ethers";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { APP_DATE_FORMAT } from "../../config/constants";
import { BlockType } from "../../enumeration/blockType";
import { WorkerStatus } from "../../enumeration/workerStatus";
import InfoLoader from "../../shared/components/InfoLoader";
import { ToastError, ToastSuccess } from "../../shared/components/Toast";
import { insertCommas } from "../../shared/helper";
import { getEllipsisTxt, getListingContractRead, getProvider } from "../../shared/helpers";
import { IAsset } from "../../shared/models/assets.model";
import { IListing } from "../../shared/models/listing.model";
import { IWorkerPermission } from "../../shared/models/workerPermission.model";
import { RootState } from "../../shared/reducers";
import { useCreateBlockEventMutation } from "../blockEvents/blockEvents.api";
import ExtendOwnershipModal from "./ExtendOwnershipModal";
import "./index.scss";
import { reset } from "./realEstate.reducer";
import RegisterOwnershipModal from "./RegisterOwnershipModal";
import WithdrawTokenModal from "./WithdrawTokenModal";

interface IRealEstateInfoProps {
  asset: IAsset;
}

export const RealEstateInfo = (props: IRealEstateInfoProps) => {
  const { asset } = props;
  const dispatch = useDispatch();
  const [createBlockEvent, { isLoading }] = useCreateBlockEventMutation();
  const [listingEntity, setListingEntity] = useState<IListing | null>(null);
  const [loadingListing, setLoadingListing] = useState<boolean>(false);
  const { signerAddress } = useSelector((state: RootState) => state.walletReducer);
  const { extendOwnerShipSuccess, extendOwnerShipTHash } = useSelector((state: RootState) => state.realEstateReducer);
  const provider = getProvider();

  const getListingInfo = async (listing: IAsset) => {
    // create asset contract reading from ether
    const assetContract = getListingContractRead(listing.address, provider);

    // invoke asset getter
    const listingId: BigNumber = await assetContract.listingId();
    const ownership: BigNumber = await assetContract.ownership();
    const value: BigNumber = await assetContract.value();
    const dailyPayment: BigNumber = await assetContract.dailyPayment();
    const owner = await assetContract.owner();
    const validator = await assetContract.validator();
    const tokenContract = await assetContract.tokenContract();
    const totalStake: BigNumber = await assetContract.totalStake();
    const rewardPool: BigNumber = await assetContract.rewardPool();

    // await all getter to complete
    Promise.all([listingId, ownership, value, dailyPayment, owner, validator, assetContract, totalStake, rewardPool]).then(() => {
      const body: IListing = {
        owner,
        validator,
        tokenContract,
        listingId: listingId.toString(),
        ownership: ownership.toString(),
        totalStake: insertCommas(ethers.utils.formatEther(totalStake.toString())),
        rewardPool: insertCommas(ethers.utils.formatEther(rewardPool.toString())),
        value: insertCommas(ethers.utils.formatEther(value.toString())),
        dailyPayment: insertCommas(ethers.utils.formatEther(dailyPayment.toString())),
      };
      setListingEntity(body);
      setLoadingListing(false);
    });
  };

  // console.log(listingEntity, "entity");

  // const getExtendOwnerShipRceipt = async (tHash: string) => {
  //   const receipt = await provider.getTransactionReceipt(tHash);
  //   Promise.all([receipt]).then(() => {
  //     console.log(receipt);
  //   });
  // };

  useEffect(() => {
    if (extendOwnerShipSuccess) {
      ToastSuccess("Gia hạn quyền sử dụng listing thành công");
      const body = {
        assetId: asset.id,
        hash: extendOwnerShipTHash,
        eventType: BlockType.OWNER_SHIP_EXTENSION,
      }
      createBlockEvent(body);
      dispatch(reset());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [extendOwnerShipSuccess]);

  useEffect(() => {
    if (asset) {
      setLoadingListing(true);
      getListingInfo(asset);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [asset, extendOwnerShipSuccess, signerAddress]);

  const [extendOwnership, setExtendOwnership] = useState<boolean>(false);
  const [withdrawToken, setWithDrawToken] = useState<boolean>(false);
  const [registerOwnership, setRegisterOwnership] = useState<boolean>(false);

  const setRequestListener = (key: boolean, setRequestState: any) => (): void => setRequestState(key);

  const [investmentCollapse, setInvestmentCollapse] = useState<boolean>(false);
  const [managementCollapse, setManagementCollapse] = useState<boolean>(false);
  const [workerCollapse, setWorkerCollapse] = useState<boolean>(false);

  const onActivitiesBtnClick = () => () => {
    if (signerAddress !== "") {
      setInvestmentCollapse(!investmentCollapse);
    } else {
      ToastError("Bạn chưa liên kết với ví của mình");
    }
  };

  const onManagementBtnClick = () => () => {
    if (signerAddress !== "") {
      setManagementCollapse(!managementCollapse);
    } else {
      ToastError("Bạn chưa liên kết với ví của mình");
    }
  };

  const titleTableStyle = {
    textAlign: "left",
    color: "#828282",
    fontSize: "0.875rem",
    lineHeight: "16px",
    fontWeight: "400",
  };

  const workerFields = [
    {
      key: "address",
      _style: titleTableStyle,
      label: "Address Wallet",
    },
    {
      key: "createdDate",
      _style: titleTableStyle,
      label: "Thời gian bắt đầu",
    },
  ];

  const workerListing: IWorkerPermission[] = [
    {
      address: "h1-0xda3ac...9999",
      createdDate: "h1-17:10- 29/11/2021",
      status: WorkerStatus.true,
    },
    {
      address: "h2-0xda3ac...9999",
      createdDate: "h2-17:10- 29/11/2021",
      status: WorkerStatus.true,
    },
    {
      address: "0xda3ac...9999",
      createdDate: "17:10- 29/11/2021",
      status: WorkerStatus.false,
    },
  ];

  const workerActiveListing = workerListing.filter((e) => e.status === WorkerStatus.true);

  const checkOwnershipDate = (timeStamp: string): boolean => {
    const currTimstamp = dayjs().unix();
    return currTimstamp <= Number(timeStamp);
  };

  const getListingOwnerStatus = (userAddress: string, listingInfo: IListing | null) => {
    if (listingInfo !== null) {
      const { ownership, owner } = listingInfo;
      if (userAddress && userAddress === owner) {
        return <p className={`ownership-checked m-0 ${checkOwnershipDate(ownership) ? "text-success" : "d-none"}`}>{checkOwnershipDate(ownership) ? "Đã sở hữu" : ""}</p>;
      } else {
        return <p className={`ownership-checked m-0 ${checkOwnershipDate(ownership) ? "text-danger" : "text-success"}`}>{checkOwnershipDate(ownership) ? "Đã có chủ sở hữu" : "Có thể sở hữu"}</p>;
      }
    }
  };

  return (
    <CContainer fluid className="px-0">
      <CCol xs={12} height="289px" className="p-0">
        <img src={asset.images} className="w-100 h-100" alt="realEstateImg" />
      </CCol>
      <CCol className="realestate-info m-0 p-0">
        <CRow className="realestate-title-info m-0 p-0">
          <CCol xs={12} className="text-dark btn-font-style mt-3">
            202 Yên Sở - Hoàng Mai - Hà Nội
          </CCol>
          <CCol xs={12} className="text-primary total-token my-3">
            {loadingListing ? (
              <InfoLoader width="300" height="29" />
            ) : (
              <p className="m-0">
                {listingEntity?.value || "_"} <span className="token-name">ANFT</span>
              </p>
            )}
          </CCol>
          <CCol xs={6} className="owner-check d-flex mb-3">
            {loadingListing ? <InfoLoader width="300" height="29" /> : getListingOwnerStatus(signerAddress, listingEntity)}
          </CCol>
        </CRow>
        <CRow className="realestate-reward-info p-0 m-0">
          {/* <CCol xs={6}>
            <p className="detail-title-font my-2">Reward rate for listing</p>
            <p className="text-success my-2 reward-number">{demoRealEstateInfo.rewardRate}</p>
          </CCol> */}
          <CCol xs={6}>
            <p className="detail-title-font my-2">The listing address</p>
            {loadingListing ? <InfoLoader width="155" height="27" /> : <p className="my-2 reward-number">{getEllipsisTxt(asset.address)}</p>}
          </CCol>
          <CCol xs={6}>
            <p className="detail-title-font my-2">The current owner</p>
            {loadingListing ? <InfoLoader width="155" height="27" /> : <p className="my-2 reward-number">{listingEntity ? getEllipsisTxt(listingEntity.owner) : "_"}</p>}
          </CCol>
          <CCol xs={6}>
            <p className="detail-title-font my-2">Sở hữu tới </p>
            {loadingListing ? (
              <InfoLoader width="155" height="27" />
            ) : (
              <p className={`my-2 reward-number ${listingEntity ? (checkOwnershipDate(listingEntity?.ownership) ? "text-success" : "text-danger") : ""}`}>
                {listingEntity ? dayjs.unix(Number(listingEntity.ownership)).format(APP_DATE_FORMAT) : "_"}
              </p>
            )}
          </CCol>
          <CCol xs={6}>
            <p className="detail-title-font my-2">Daily payment</p>

            {loadingListing ? (
              <InfoLoader width="155" height="27" />
            ) : (
              <p className="my-2 reward-number">
                {listingEntity?.dailyPayment || "_"} <span className="token-name">ANFT</span>
              </p>
            )}
          </CCol>
          <CCol xs={6}>
            <p className="detail-title-font my-2">Total Reward</p>
            {loadingListing ? (
              <InfoLoader width="155" height="27" />
            ) : (
              <p className="text-primary my-2 reward-number">
                {listingEntity?.totalStake || "_"} <span className="token-name">ANFT</span>
              </p>
            )}
          </CCol>
          <CCol xs={6}>
            <p className="detail-title-font my-2">Reward Pool</p>
            {loadingListing ? (
              <InfoLoader width="155" height="27" />
            ) : (
              <p className="my-2 reward-number">
                {listingEntity?.rewardPool || "_"} <span className="token-name">ANFT</span>
              </p>
            )}
          </CCol>

          {/* <CCol xs={6}>
            <p className="detail-title-font my-2">Owner wallet</p>
            <p className="text-primary my-2 reward-number">{demoRealEstateInfo.ownerWalletId}</p>
          </CCol>
           */}
          {/* Show-more-2-info-if-role-owner */}
          {/* <CCol xs={6}>
            <p className="detail-title-font my-2">Tổng ANFT đã nạp</p>
            <p className="text-primary my-2 reward-number">
              {demoRealEstateInfo.tokenRecharged} <span className="token-name">ANFT</span>
            </p>
          </CCol>  */}

          <CCol xs={12} className="text-center">
            <p className="text-primary my-2">
              <CLink to="#" onClick={() => setWorkerCollapse(!workerCollapse)}>
                <FontAwesomeIcon icon={faIdBadge} /> <u>Xem quyền khai thác</u>
              </CLink>
            </p>
          </CCol>
          <CCol xs={12}>
            <CCollapse show={workerCollapse}>
              <CRow>
                <CCol xs={12}>
                  <CDataTable
                    striped
                    items={workerActiveListing}
                    fields={workerFields}
                    responsive
                    hover
                    header
                    scopedSlots={{
                      address: ({ address }: IWorkerPermission) => {
                        return <td>{address ? address : "_"}</td>;
                      },
                      createdDate: ({ createdDate }: IWorkerPermission) => {
                        return <td>{createdDate ? createdDate : "_"}</td>;
                      },
                    }}
                  />
                </CCol>
              </CRow>
            </CCollapse>
          </CCol>

          <CCol xs={12} className="mt-2 ">
            <CButton className="px-3 w-100 btn-radius-50 btn-font-style btn btn-outline-primary" onClick={onActivitiesBtnClick()}>
              Hoạt động đầu tư
            </CButton>
          </CCol>
          <CCol xs={12}>
            <CCollapse show={investmentCollapse}>
              <CCard className="activities-card mt-2 mb-0">
                <CCardBody className="p-2">
                  <CRow className="mx-0">
                    <CLink href="#" target="_blank" onClick={setRequestListener(true, setRegisterOwnership)}>
                      <FontAwesomeIcon icon={faEdit} /> Đăng ký sở hữu
                    </CLink>
                  </CRow>
                  <CRow className="mt-2 mx-0">
                    <CLink to="/cms/register_reward">
                      <FontAwesomeIcon icon={faDonate} /> Đăng ký nhận thưởng
                    </CLink>
                  </CRow>
                </CCardBody>
              </CCard>
            </CCollapse>
          </CCol>
          <CCol xs={12} className="mt-2">
            <CButton className={`px-3 w-100 btn-radius-50 btn-font-style btn btn-primary ${signerAddress === listingEntity?.owner ? "d-block" : "d-none"}`} onClick={onManagementBtnClick()}>
              Quản lý sở hữu
            </CButton>
          </CCol>
          {/* <RegisterOwnershipModal visible={registerOwnership} setVisible={setRegisterOwnership} /> */}

          <CCol xs={12}>
            <CCollapse show={managementCollapse}>
              <CCard className="mt-2 activities-card mb-0">
                <CCardBody className="p-2">
                  <CRow className="mx-0">
                    <CLink href="#" target="_blank" onClick={setRequestListener(true, setWithDrawToken)}>
                      <FontAwesomeIcon icon={faArrowAltCircleUp} /> Rút ANFT
                    </CLink>
                  </CRow>
                  <CRow className="my-2 mx-0">
                    <CLink href="#" target="_blank" onClick={setRequestListener(true, setExtendOwnership)}>
                      <FontAwesomeIcon icon={faArrowAltCircleDown} /> Nạp thêm
                    </CLink>
                  </CRow>
                  <CRow className="mx-0">
                    <CLink to="/cms/worker_management">
                      <FontAwesomeIcon icon={faClipboard} /> Quản lý quyền khai thác
                    </CLink>
                  </CRow>
                </CCardBody>
              </CCard>
            </CCollapse>
          </CCol>
          {registerOwnership && <RegisterOwnershipModal address={asset.address} dailyPayment={listingEntity?.dailyPayment || "0"} visible={registerOwnership} setVisible={setRegisterOwnership} />}
          {extendOwnership && <ExtendOwnershipModal visible={extendOwnership} setVisible={setExtendOwnership} />}
          {withdrawToken && <WithdrawTokenModal visible={withdrawToken} setVisible={setWithDrawToken} />}
        </CRow>
      </CCol>
    </CContainer>
  );
};
