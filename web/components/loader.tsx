import { Oval } from 'react-loader-spinner';
import { Colors } from '../utils/theme';

interface LoaderProps {
  size: number;
}

export default function Loader(props: LoaderProps): React.ReactElement {
  const { size } = props;

  return (
    <Oval
      height={size}
      width={size}
      color={Colors.primary}
      secondaryColor={Colors.secondary}
    />
  );
}
