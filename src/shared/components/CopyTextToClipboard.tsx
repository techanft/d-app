import CIcon from '@coreui/icons-react';
import { CButton, CTooltip } from '@coreui/react';
import React from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { useTranslation } from 'react-i18next';
import { getEllipsisTxt } from '../casual-helpers';

interface ICopyTextToClipBoardProps {
  text: string;
  inputClassName?: string;
  iconClassName?: string;
  textNumber?: number;
}
const CopyTextToClipBoard = (props: ICopyTextToClipBoardProps) => {
  const { text, inputClassName, iconClassName, textNumber } = props;
  const {t } = useTranslation();
  return (
    <CTooltip content={t("anftDapp.copyTextToClipBoard.copied")} placement="bottom">
      <CopyToClipboard text={text}>
        <span className={inputClassName}>
          {getEllipsisTxt(text, textNumber)}
          <CButton className="p-0 pb-3 ml-1">
            <CIcon name="cil-copy" size="sm" className={iconClassName} />
          </CButton>
        </span>
      </CopyToClipboard>
    </CTooltip>
  );
};

export default CopyTextToClipBoard;
