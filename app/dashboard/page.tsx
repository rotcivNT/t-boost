import { OrganizationList } from "@clerk/nextjs";

function DashboardPage() {
  return (
    <div className="flex justify-center items-center w-screen h-screen">
      <OrganizationList
        afterSelectOrganizationUrl="/workspace/:id/home"
        afterSelectPersonalUrl="/workspace/:id/home"
      />
    </div>
  );
}

export default DashboardPage;
