import React, { useEffect, useState } from "react";
import { Button, Container, Typography } from "@mui/material";
import { CloudUpload } from "@mui/icons-material";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";
import moment from "moment";

import VisibilityIcon from "@mui/icons-material/Visibility";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import InvoiceModal from "./components/InvoiceModal";

import toast, { Toaster } from 'react-hot-toast';


import Divider from "./components/Divider";

const App = () => {
  const [myorders, setMyOrders] = useState([]);

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [matchingOrders, setMatchingOrders] = useState([]);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append("csvFile", file);

    try {
      const response = await axios.post("/api/upload", formData);

      if (response?.data.success) {
        toast.success(response.data.message);
        window.location.reload()

      } else {
        console.log("Error uploading file: ", response.error);
      }
    } catch (error) {
      console.log("Error uploading file: ", error);
    }
  };

  const columns = [
    {
      field: "orderID",
      headerName: "Order ID",
      width: 150,
      renderCell: (params) => (
        <div className="flex items-center gap-3">
          <span>{params.value}</span>
          <span
            onClick={() => {
              handleRowSelection(params);
            }}
          >
            <VisibilityIcon className="cursor-pointer" />
          </span>
        </div>
      ),
    },
    { field: "customer", headerName: "Customer", width: 200 },
    {
      field: "totalAmount",
      headerName: "Total Amount",
      width: 150,
      valueGetter: (params) =>
        (params.row.quantity * params.row.unitPrice).toFixed(2),
    },
    {
      field: "orderDate",
      headerName: "Order Date",
      width: 200,
      valueFormatter: (params) => moment(params.value).format("DD/MM/YYYY"),
    },
    {
      field: "generateInvoice",
      headerName: "Generate Invoice",
      width: 200,
      renderCell: (params) => (
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
          handleGenerateInvoice(params.row)
          setInvoiceModalOpen(true);
          }}
        >
          {/* {console.log(params.row)} */}
          Generate Invoice
        </Button>
      ),
    },
  ];

  // function to get data from the database

  const getData = async () => {
    try {
      const response = await axios.get("/api/get-data");

      if (response?.data.success) {
        // console.log("Data fetched successfully");
        toast.success(response.data.message);
        // console.log(response.data.orders)
        const ordersWithIds = response?.data.orders.map((order, index) => ({
          ...order,
          id: index + 1,
          totalAmount: order.quantity * order.unitPrice,
        }));

        setMyOrders(ordersWithIds);
      } else {
        // console.log("Error in the fetching data: ", response.error);
        toast.error(response.error.message);
      }
    } catch (error) {
      console.log("Error fetching data: ", error);
    }
  };

  const handleRowSelection = (params) => {
    console.log("params", params);
    // Get the selected row data and open the modal
    const selectedOrderId = params.row.orderID;
    const selectedRow = myorders.find(
      (order) => order.orderID === selectedOrderId
    );
    setSelectedOrder(selectedRow);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    // Close the modal
    setIsModalOpen(false);
  };

  useEffect(() => {
    getData();
  }, []);

  const handleGenerateInvoice = async (order) => {
    // Api call for this order id to get all the orders from this order id:

    try {
      console.log("orderid", order.orderID);

      const response = await axios.get(`/api/orders/${order.orderID}`);

      if (response?.data.success) {
        setMatchingOrders(response.data.orders);
        // console.log("Matching orders", matchingOrders);
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      console.log("Error in fetching matching orders of this OrderID", error);
    }

    console.log(`Generating invoice for Order ID: ${order.orderID}`);
  };

  const [invoiceModalOpen, setInvoiceModalOpen] = useState(false);

  const handleCloseInvoiceModal = ()=>{
    setInvoiceModalOpen(false);
  }

  return (


    <div className="min-h-screen p-4 flex flex-col gap-16">

<div className="w-full">

      <div style={{
        width: "100%", // Full width for mobile devices
      }} className="m-auto flex flex-col items-center bg-purple-100 px-4 py-3">

        <Typography gutterBottom variant="h4" className='text-purple-700'>
          Everything Mart
        </Typography>

        <label htmlFor="csv-upload">
          <Button
            variant="contained"
            color="primary"
            startIcon={<CloudUpload />}
            component="span"
            className="mb-6 mt-3 md:mt-0 md:ml-6" // Add margin and spacing for larger screens
          >
            Upload CSV
          </Button>
          <input
            id="csv-upload"
            type="file"
            accept=".csv"
            className="hidden"
            onChange={handleFileUpload}
          />
        </label>

      </div>

    </div>

      

      <Container maxWidth="lg">
        {!myorders ? (
          "NO Orders Yet"
        ) : (
          <>
            <div style={{ height: 400, width: "85%", margin: "auto" }}>

                <DataGrid rows={myorders} columns={columns} pageSize={5}/>

            </div>

            <Dialog
              open={isModalOpen}
              onClose={handleCloseModal}
              maxWidth="sm"
              fullWidth
            >
              {selectedOrder && (
                <>
                  <DialogTitle> <h1 className="text-purple-600 font-bold">Order Details</h1> </DialogTitle>
                  <DialogContent>


                    <div className="p-4 bg-purple-100 rounded-sm">
                      <div className="flex justify-between">
                        <p>Order ID #</p>
                        <p>{selectedOrder.orderID}</p>
                      </div>

                      <Divider color={"purple"} />

                      <div className="flex justify-between">
                        <p>Customer</p>
                        <p>{selectedOrder.customer}</p>
                      </div>


                      <Divider color={"purple"} />

                      <div className="flex justify-between">
                        <p>Order Date</p>
                        <p>
                          {moment(selectedOrder.orderDate).format("DD/MM/YYYY")}
                        </p>
                      </div>


                      <Divider color={"purple"} />

                      <div className="flex justify-between">
                        <p>Item Name</p>
                        <p>{selectedOrder.itemName}</p>
                      </div>


                      <Divider color={"purple"} />

                      <div className="flex justify-between">
                        <p>Quantity</p>
                        <p>{selectedOrder.quantity}</p>
                      </div>


                      <Divider color={"purple"} />

                      <div className="flex justify-between">
                        <p>Unit Price</p>
                        <p>{selectedOrder.unitPrice}</p>
                      </div>
                    </div>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={handleCloseModal} color="primary">
                      Close
                    </Button>
                  </DialogActions>
                </>
              )}
            </Dialog>

{(

            <InvoiceModal
              isOpen={invoiceModalOpen}
              onClose={handleCloseInvoiceModal}
              matchingOrders={matchingOrders}
            />
            
  )
}


          </>
        )}
      </Container>
    </div>
  );
};

export default App;






