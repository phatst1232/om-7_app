import Image from 'next/image';
import loginLogo from '../../icon/clv_logo.png';
import headerLogo from '../../icon/logo.png';
import { CSSProperties } from 'react';

interface IProps {
  type?: 'login' | 'header';
  style?: CSSProperties | undefined;
}

export default function ClvLogo(props: IProps) {
  const { type, style } = props;

  return (
    <Image
      src={
        type === 'login'
          ? loginLogo
          : type === 'header'
          ? headerLogo
          : headerLogo
      }
      style={style}
      priority={false}
      alt='CyberLogitec Viet Nam - Logo'
    />
  );
}
