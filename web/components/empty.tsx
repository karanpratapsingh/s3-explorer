import { Spacer } from '@geist-ui/core';

interface EmptyProps {
  text?: string;
  icon?: React.ReactNode;
}

export default function Empty(props: EmptyProps): React.ReactElement {
  const { text, icon } = props;

  return (
    <div className='flex flex-1 flex-col items-center justify-center text-secondary'>
      {icon}
      <Spacer h={1} />
      <span className='italic text-light'>{text}</span>
    </div>
  );
}
