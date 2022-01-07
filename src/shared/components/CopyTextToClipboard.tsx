import CIcon from '@coreui/icons-react';
import { CTooltip, CButton } from '@coreui/react';
import React from 'react'
import CopyToClipboard from 'react-copy-to-clipboard';
import { getEllipsisTxt } from '../casual-helpers';

interface ICopyTextToClipBoardProps {
    text: string;
    inputClassName?: string;
    iconClassName?: string;
}
const CopyTextToClipBoard = ({text, inputClassName, iconClassName} : ICopyTextToClipBoardProps) => {
    return (
        <CTooltip content="Copied" placement="bottom">
        <CopyToClipboard text={text}>
          <span className={inputClassName}>
            {getEllipsisTxt(text)}
            <CButton className="p-0 pb-3 ml-1">
              <CIcon name="cil-copy" size="sm" className={iconClassName}/>
            </CButton>
          </span>
        </CopyToClipboard>
      </CTooltip>
    )
}

export default CopyTextToClipBoard;