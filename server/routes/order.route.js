const router = require('express').Router();
const Order = require('../models/order.model.js');

const multer = require('multer');
const upload = multer({dest: 'uploads/'});

const fs = require('fs');
const path = require('path');
const csv = require('csvtojson');





// Endpoint to handle the CSV file upload
router.post('/upload', upload.single('csvFile'), async (req, res) => {
  try {
    const orderData = [];
    await csv()
      .fromFile(req.file.path)

      .then((response) => {

        // console.log("response", response);

        for (const item of response) {
          // Split the data into individual fields
          const [orderID, customer, orderDate, itemName, quantity, unitPrice] =
            item['Order ID,Customer,Order Date,Item Name,Quantity,Unit Price'].split(
              ','
            );

          orderData.push({
            orderID,
            customer,
            orderDate: new Date(orderDate.trim()), // Assuming date is in a proper format
            itemName,
            quantity: parseInt(quantity.trim(), 10), // Assuming it's an integer
            unitPrice: parseFloat(unitPrice.trim()), // Assuming it's a float
          });
        }



      });

    await Order.insertMany(orderData);

    fs.unlinkSync(req.file.path);

    res.status(200).json({ success:true, message: 'CSV data uploaded and saved successfully' });
  } catch (error) {
    console.error('Error saving CSV data:', error);
    res.status(500).json({ error: 'Failed to save CSV data' });
  }
});



// get the data from database for the table


router.get('/get-data', async(req, res)=>{
  try{
    const orders = await Order.find();
    return res.status(200).json({
      success:true,
      message:'Data fetched Successfully',
      orders,
    })
  }
  catch(error){
    console.log(error);
    return res.status(500).json({
      error:"Failed to get the data from database"
    })
  }
})

router.get('/orders/:orderId', async (req, res) => {
  const orderId = req.params.orderId;

  try {
    // Find all orders with the given orderID
    const orders = await Order.find({ orderID: orderId });
    res.status(200).json({ success: true, orders });

  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch orders' });
  }
});










  
module.exports = router;


