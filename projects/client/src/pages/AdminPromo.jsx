import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import AdminDiscount from "./AdminDiscount";
import AdminVoucher from "./AdminVoucher";

function AdminPromo() {
  return (
    <div className="m-7">
      <h1 className="text-4xl pt-5 font-semibold tracking-tight text-pink-500 cursor-pointer mb-7">
        Promo Management
      </h1>
      <Tabs>
        <TabList>
          <Tab>Discount</Tab>
          <Tab>Voucher</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <AdminDiscount />
          </TabPanel>
          <TabPanel>
            <AdminVoucher />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </div>
  );
}

export default AdminPromo;
