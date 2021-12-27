import CIcon from '@coreui/icons-react';
import { CTooltip, CButton } from '@coreui/react';
import React from 'react'
import CopyToClipboard from 'react-copy-to-clipboard';
import { getEllipsisTxt } from '../casual-helpers';

interface ICopyTextToClipBoardProps {
    text: string;
}
const CopyTextToClipBoard = ({text} : ICopyTextToClipBoardProps) => {
    return (
        <CTooltip content="Copied" placement="bottom">
        <CopyToClipboard text={text}>
          <p className="my-2 value-text copy-address">
            {getEllipsisTxt(text)}
            <CButton className="p-0 pb-3 ml-1">
              <CIcon name="cil-copy" size="sm" />
            </CButton>
          </p>
        </CopyToClipboard>
      </CTooltip>
    )
}

export default CopyTextToClipBoard;