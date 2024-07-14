import Link from "next/link";

interface IProps {
  data: any;
}
function AcceptInvitation({ data }: IProps) {
  console.log(data);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-10 rounded-lg shadow-lg text-center">
        <h1 className="text-2xl font-bold text-green-600">Thành công!</h1>
        <p className="mt-4 text-gray-600">
          Bạn đã tham gia cuộc hội thoại thành công.
        </p>
        <Link
          href="/"
          className="mt-6 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          Quay lại trang chủ
        </Link>
      </div>
    </div>
  );
}

export default AcceptInvitation;
