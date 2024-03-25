import express from 'express';
import cors from 'cors';
import bcrypt from 'bcrypt';
import db from './connect.js'; 
import multer from "multer";
import { fileURLToPath } from 'url';
import fs from 'fs';
import path from 'path';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
app.use(cors());
app.use(express.json());

// Define storage options
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Set the destination folder where the file will be stored
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    // Set the filename to be unique by appending a timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    // Extract file extension
    const ext = path.extname(file.originalname);
    // Construct the filename
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

// Initialize Multer with storage options
const upload = multer({ storage: storage });


// Route to handle file uploads
app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    // Check if a file was uploaded
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // If a file was uploaded, you can access its details via req.file
      const fileName = req.file.filename;
      const filePath = req.file.path;

    // Respond with a success message
    res.status(200).json({
      success: true,
      message: "File uploaded successfully",
      fileName: fileName,
      filePath: filePath,
    });
      
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Define a route to handle file download
app.get('/download/:filePath', (req, res) => {
    const file = req.params.filePath;
    const filePath = path.resolve(__dirname, file); // Resolve file path

    // Check if file exists
    if (fs.existsSync(filePath)) {
        // Provide proper file name for download
        const fileName = path.basename(filePath);
        res.download(filePath, fileName, (err) => {
            if (err) {
                // Handle download error
                console.error('Error downloading file:', err);
                res.status(500).send('Error downloading file');
            }
        });
    } else {
        // If file does not exist, send 404 error
        res.status(404).send('File not found');
    }
});

// |||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||//
// ||||||||||||||||||||||||||||||||||||||| Authentication ||||||||||||||||||||||||||||||||||||//
// |||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||//
// |||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||//


// Route to add a new user
app.post('/signup', async (req, res) => {
    const { name, email, password, phone } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10); // Hash the password
    const sql = 'INSERT INTO users (name, email, password, phone) VALUES (?, ?, ?, ?)';
    db.query(sql, [name, email, hashedPassword, phone], (err, result) => {
        if (err) {
            console.log('Error adding user:', err);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            const userId = result.insertId; // Assuming the ID of the inserted user
            const userData = { id: userId, name, email, phone }; // Create user data object
            res.status(201).json({ message: 'User added successfully', userData });
        }
    });
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const sql = 'SELECT * FROM users WHERE email = ?';
    db.query(sql, [email], async (err, result) => {
        if (err) {
            console.log('Error with login:', err);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            if (result.length > 0) {
                const userData = result[0];
                const hashedPassword = userData.password;
                const passwordMatch = await bcrypt.compare(password, hashedPassword); // Compare the hashed password with the input password
                if (passwordMatch) {
                    res.status(200).json({ userData });
                } else {
                    res.status(401).json({ error: 'Unauthorized' });
                }
            } else {
                res.status(401).json({ error: 'Unauthorized' });
            }
        }
    });
});



// |||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||//
// ||||||||||||||||||||||||||||||||||||||| DEPARTMENT |||||||||||||||||||||||||||||||||||||||||//
// |||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||//
// |||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||//

//departments_read
app.get('/departments_re', (req, res) => {
    const sql = "SELECT * FROM departments ORDER BY updated_at DESC";
    db.query(sql, (err, result) => {
        if (err) {
            console.log(err);
        }
       return res.json(result);
    })
})

//departments_write
app.post('/departments_wr', async (req, res) => {
    const { code, description, created_at, updated_at } = req.body;

    if (!code || !description || !created_at || !updated_at) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const sql = 'INSERT INTO departments (code, description, created_at, updated_at) VALUES (?, ?, ?, ?)';
        const result = await db.query(sql, [code, description, created_at, updated_at]);

        const insertedDepartment = result[0]; 

        res.status(201).json({ message: 'Department added successfully', department: insertedDepartment });
    } catch (error) {
        console.log('Error adding department:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

//departments_update
app.post('/departments_up', async (req, res) => {
    const {id, code, description, updated_at } = req.body;

    if (!id || !code || !description || !updated_at ) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const sql = 'UPDATE departments SET code = ?, description = ?, updated_at = ? WHERE id = ?';
        const result =   await db.query(sql, [code, description, updated_at, id]);
        const insertedDepartment = result[0]; 
        
        res.status(200).json({ message: 'Department updated successfully',insertedDepartment });
    } catch (error) {
        console.log('Error updating department:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// departments_delete
app.delete('/departments_del/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const sql = 'DELETE FROM departments WHERE id = ?';
        const result = await db.query(sql, [id]);
        const insertedDepartment = result[0]; 
        res.status(200).json({ message: 'Department deleted successfully',insertedDepartment });
    } catch (error) {
        console.log('Error deleting department:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// |||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||//
// ||||||||||||||||||||||||||||||||||||||| Property |||||||||||||||||||||||||||||||||||||||||//
// |||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||//
// |||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||//

//Property_read
app.get('/properties_re', (req, res) => {
    const sql = "SELECT * FROM properties ORDER BY updated_at DESC";
    db.query(sql, (err, result) => {
        if (err) {
            console.log(err);
        }
       return res.json(result);
    })
})

//Property_write
app.post('/properties_wr', async (req, res) => {
     const { code, description,department, address, created_at, updated_at } = req.body;

 
    try {
        const sql = 'INSERT INTO properties (code, description,department_id, address, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)';
        const result = await db.query(sql, [code, description,department,address, created_at, updated_at]);

        const insertedProperties = result[0]; 

        res.status(201).json({ message: 'Property added successfully', properties: insertedProperties });
    } catch (error) {
        console.log('Error adding properties:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
    
})

// Property_update
app.post('/properties_up', async (req, res) => {
    const { id, code, description, department, address, updated_at } = req.body;
    if (!id || !code || !department || !description || !updated_at ) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const sql = 'UPDATE properties SET code = ?, description = ?, department_id = ?, address = ?, updated_at = ? WHERE id = ?';
        const result = await db.query(sql, [code, description, department, address, updated_at, id]);
        const insertedProperties = result[0]; 
        res.status(200).json({ message: 'Property updated successfully',insertedProperties });
    } catch (error) {
        // Handle errors
        console.log('Error updating property:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// properties_delete
app.delete('/properties_del/:id', async (req, res) => {
    const { id } = req.params;
    if (!id) {
         return res.status(400).json({ error: 'Missing required field' });
    }
    try {
        const sql = 'DELETE FROM properties WHERE id = ?';
        const result = await db.query(sql, [id]);
        const insertedProperties = result[0]; 

        res.status(200).json({ message: 'Property deleted successfully',insertedProperties });
    } catch (error) {
        console.log('Error deleting property:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// |||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||//
// ||||||||||||||||||||||||||||||||||||||| Vendor  |||||||||||||||||||||||||||||||||||||||||||//
// |||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||//
// |||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||//

//Vendor_read
app.get('/vendors_re', (req, res) => {
    const sql = "SELECT * FROM vendors ORDER BY updated_at DESC";
    db.query(sql, (err, result) => {
        if (err) {
            console.log(err);
        }
       return res.json(result);
    })
})

//Vendor_write
app.post('/vendors_wr', async (req, res) => {
  const { code, name, address, phone, creditlimit, created_at, updated_at } = req.body;

  // Validate required fields
  if (!code || !name  || !created_at || !updated_at) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const sql = 'INSERT INTO vendors (code, name, address, phone, creditlimit, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)';
    const result = await db.query(sql, [code, name, address, phone, creditlimit, created_at, updated_at]);

    const insertedVendors = result[0]; 

    res.status(201).json({ message: 'Vendor added successfully', vendors: insertedVendors });
  } catch (error) {
    console.log('Error adding vendor:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Vendor_update
app.post('/vendors_up', async (req, res) => {
    const { id, code, name, address, phone, creditlimit, updated_at } = req.body;
    
    if (!id || !code || !updated_at) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const sql = 'UPDATE vendors SET code = ?, name = ?, address = ?, phone = ?, creditlimit = ?, updated_at = ? WHERE id = ?';
        const result = await db.query(sql, [code, name, address, phone, creditlimit, updated_at, id]);
        const insertedVendors = result[0]; 
        res.status(200).json({ message: 'Vendor updated successfully',insertedVendors});
    } catch (error) {
        console.log('Error updating property:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Vendor_delete
app.delete('/vendors_del/:id', async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ error: 'Missing required field' });
    }
    try {
        const sql = 'DELETE FROM vendors WHERE id = ?';
        const result = await db.query(sql, [id]);
        const deletedVendors = result[0];

        res.status(200).json({ message: 'Vendor deleted successfully', deletedVendors });
    } catch (error) {
        console.log('Error deleting vendor:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// |||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||//
// ||||||||||||||||||||||||||||||||||||||| Contract  |||||||||||||||||||||||||||||||||||||||||//
// |||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||//
// |||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||//

//Contract_read
app.get('/contracts_re', (req, res) => {
    const sql = 'SELECT * FROM rent_contracts ORDER BY updated_at DESC;';
    db.query(sql, (err, result) => {
        if (err) {
            console.log(err);
        }
       return res.json(result);
    })
    
})

// Contract_write
app.post('/contracts_wr', async (req, res) => {
  const { vendor, property, monthlyRent, duration, numOfInstallment, startDate, expiryDate, paymentStartDate, frequency, code, remarks, status,created_at, updated_at,file } = req.body;

  // Validate required fields
  if (!vendor || !property || !monthlyRent || !duration || !numOfInstallment || !startDate || !expiryDate || !paymentStartDate || !frequency || !code || !created_at || !updated_at ) {
      console.log('Missing required fields');
    }
          console.log("File:", file);

  try {
    const sql = 'INSERT INTO rent_contracts (vendor_id, property_id, monthly_installment, no_of_installment,duration,  start_date, expiry_date, payment_start_date, frequent_of_payment, agreement, remark, status, created_at, updated_at,file_path) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)';
    const result = await db.query(sql, [vendor, property, monthlyRent, numOfInstallment,duration,startDate, expiryDate, paymentStartDate, frequency, code, remarks,status, created_at, updated_at,file]);

    const insertedContract = result[0]; 
    res.status(201).json({ message: 'Contract added successfully', contract: insertedContract });
  } catch (error) {
    console.log('Error adding contract:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Contract_update
app.post('/contracts_up', async (req, res) => {
  const { id, vendor, property, monthlyRent, duration, numOfInstallment, startDate, expiryDate, paymentStartDate, frequency, code, remarks, status, updated_at } = req.body;

  // Validate required fields
  if (!id || !vendor || !property || !monthlyRent || !duration || !numOfInstallment || !startDate || !expiryDate || !paymentStartDate || !frequency || !code || !updated_at) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const sql = 'UPDATE rent_contracts SET vendor_id = ?, property_id = ?, monthly_installment = ?, no_of_installment = ?, duration = ?, start_date = ?, expiry_date = ?, payment_start_date = ?, frequent_of_payment = ?, agreement = ?, remark = ?, status = ?, updated_at = ? WHERE id = ?';
    const result = await db.query(sql, [vendor, property, monthlyRent, numOfInstallment, duration, startDate, expiryDate, paymentStartDate, frequency, code, remarks, status, updated_at, id]);

    const updatedContract = result[0]; 
    res.status(200).json({ message: 'Contract updated successfully', contract: updatedContract });
  } catch (error) {
    console.log('Error updating contract:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Contract_delete
app.delete('/contracts_del/:id', async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ error: 'Missing required field' });
  }
  try {
    const sql = 'DELETE FROM rent_contracts WHERE id = ?';
    const result = await db.query(sql, [id]);
    const deletedContracts = result[0];

    res.status(200).json({ message: 'Contract deleted successfully', deletedContracts });
  } catch (error) {
    console.log('Error deleting contract:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// |||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||//
// ||||||||||||||||||||||||||||||||||||||| Schedule  |||||||||||||||||||||||||||||||||||||||||//
// |||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||//

//Schedule_read_specific
app.get("/schedule/:id", (req, res) => {
  const contractId = req.params.id; 
  const sql =
    "SELECT * FROM payment_schedules WHERE rent_contract_id = ? ORDER BY updated_at DESC";
  db.query(sql, [contractId], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Internal server error" }); // Send error response if there's an error
    }
    return res.json(result); // Send the result as JSON response
  });
});

//Schedule_read_all
app.get("/Schedule_re", (req, res) => {
  const sql = "SELECT DISTINCT rent_contract_id FROM payment_schedules WHERE rent_contract_id IS NOT NULL ORDER BY rent_contract_id ASC";
  db.query(sql, (err, result) => {
    if (err) {
      console.log(err);
    }
    return res.json(result);
  });
});

//Schedule_write
app.post("/schedules_wr", async (req, res) => {
  const {
    contract_id,
    next_payment_date,
    agreement,
    payment_amount,
    status,
    created_at,
    updated_at,
  } = req.body;

  // Validate required fields
  if (
    !contract_id ||
    !next_payment_date ||
    !payment_amount ||
    !agreement ||
    !status ||
    !created_at ||
    !updated_at
  ) {
    console.log("Missing required fields");
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const sql =
    "INSERT INTO payment_schedules (rent_contract_id, next_payment_date, payment_amount, status, created_at, updated_at,agreement) VALUES (?, ?, ?, ?, ?, ?,?)";
    const result = await db.query(sql, [
      contract_id,
      next_payment_date,
      payment_amount,
      status,
      created_at,
      updated_at,
      agreement,
    ]);

    const insertedSchedule = result[0];
    console.log("Schedule added successfully:", insertedSchedule);
    return res.status(201).json({
      message: "Schedule added successfully",
      schedule: insertedSchedule,
    });
  } catch (error) {
    console.log("Error adding schedule:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

//Schedule_update
app.post("/schedules_up", async (req, res) => {
  const { id, next_payment_date, payment_amount, updated_at } = req.body;

  if (!id || !next_payment_date || !payment_amount || !updated_at) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const sql =
    "UPDATE payment_schedules SET next_payment_date = ?, payment_amount = ?, updated_at = ? WHERE id = ?";
    await db.query(sql, [next_payment_date, payment_amount, updated_at, id]);
    res.status(200).json({ message: "Schedule updated successfully" });
  } catch (error) {
    console.log("Error updating schedule:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Schedule_delete
app.delete("/schedules_del/:id", async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ error: "Missing required field" });
  }
  try {
    const sql = "DELETE  FROM payment_schedules WHERE rent_contract_id = ?";
    const result = await db.query(sql, [id]);
    const deletedSchedules = result[0];

    res.status(200).json({
      message: "Schedules deleted successfully",
      deletedSchedules,
    });
  } catch (error) {
    console.log("Error deleting Schedules:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});



const port = 5050;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
