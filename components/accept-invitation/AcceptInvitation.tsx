interface IProps {
  data: any;
}
function AcceptInvitation({ data }: IProps) {
  return <div>{JSON.stringify(data)}</div>;
}

export default AcceptInvitation;
