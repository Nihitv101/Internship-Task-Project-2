import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
} from "@mui/material";



import html2pdf from 'html2pdf.js'
import moment from "moment";

import toast from 'react-hot-toast'

const InvoiceModal = ({ isOpen, onClose, matchingOrders }) => {
    if (!isOpen || !matchingOrders || matchingOrders.length === 0) return null;


  let total=0;

    // Calculate the total
    matchingOrders.forEach((item) => {
        total += item.quantity * item.unitPrice;
      });


//   console.log("matchingorders", matchingOrders);



  const handleSaveAsPDF = () => {
    // Get the modal content as HTML element
    const modalContent = document.getElementById("invoice-modal-content");

    // Set the options for html2pdf.js
    const options = {
      margin: 10,
      filename: `Invoice_${matchingOrders[0].orderID}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };

    // Generate the PDF
    html2pdf().from(modalContent).set(options).save();
    toast.success("Invoice Downloaded")
  };




  return (
    <>
      {matchingOrders.length > 0 ? (
        <>
          <Dialog open={isOpen} onClose={onClose} maxWidth="lg" fullWidth>
            <DialogTitle> {<h1 className="text-purple-500 text-2xl font-bold">Invoice Details</h1>} </DialogTitle>
            <DialogContent id="invoice-modal-content">
        <div>
          <div>


            <div>
              <div className="flex gap-3">
                <p className="text-gray-700">Invoice Number#</p>
                <span>{matchingOrders[0].orderID}</span>
              </div>
              <div className="flex gap-3">
                <p className="text-gray-700">Invoice Date </p>
                <span>
                  {moment(matchingOrders[0].orderDate).format("DD/MM/YYYY")}
                </span>
              </div>
            </div>

            <div className="w-[50%] border border-2 h-[100px] flex items-center p-4 my-8 rounded-md bg-purple-100">
                <h1> <span className="text-purple-500 text-lg">Billed To : </span> <span className="font-bold text-lg">{matchingOrders[0].customer}</span> </h1>
            </div>
            



          </div>
          <div>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow className="bg-purple-600">
                    <TableCell>{ <h1 className="text-white">Serial Number</h1> }</TableCell>
                    <TableCell>{ <h1 className="text-white">Item Name</h1> }</TableCell>
                    <TableCell>{ <h1 className="text-white">Quantity</h1> }</TableCell>
                    
                    <TableCell>{ <h1 className="text-white">Price</h1> }</TableCell>
                    
                    <TableCell>{ <h1 className="text-white">Amount</h1> }</TableCell>

                  </TableRow>
                </TableHead>
                <TableBody>
                  {/* Map through related items and display them in rows */}
                  {matchingOrders.map((item, index) =>  (
                    

                    <>

                        <TableRow   key={item._id}
    className={index % 2 !== 0 ? "bg-purple-100" : ""} >
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{item.itemName}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>{item.unitPrice}</TableCell>
                        <TableCell>
                            {(item.quantity * item.unitPrice).toFixed(2)}
                        </TableCell>
                        </TableRow>


                    </>
                    
      
                  ))}



                </TableBody>
              </Table>
            </TableContainer>
        

            <div className=" flex justify-end my-3" >
                <div className="flex gap-3 py-2 px-3" style={{
                    borderTop:'2px solid black',
                    borderBottom:'2px solid black',
                }}>
                    <h1>Total (USD)</h1>
                    <h1>{(total).toFixed(2)}</h1>
                </div>

            </div>




          </div>
        </div>
      </DialogContent>
            <DialogActions>
              <Button onClick={onClose} color="primary">
                Close
              </Button>
              <Button onClick={handleSaveAsPDF} color="primary">
                Download as PDF
              </Button>
            </DialogActions>
          </Dialog>
        </>
      ) : (
        ""
      )}
    </>
  );
};

export default InvoiceModal;
