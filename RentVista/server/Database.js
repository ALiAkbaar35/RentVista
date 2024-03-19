import express from 'express';
import cors from 'cors';
import bcrypt from 'bcrypt';
import db from './connect.js'; 

const app = express();
app.use(cors());
app.use(express.json());

// |||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||//
// ||||||||||||||||||||||||||||||||||||||| Authentication ||||||||||||||||||||||||||||||||||||//
// |||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||//
// |||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||//


// Route to add a new user
app.post('/signup', async (req, res) => {
    const { name, email, password, phone } = req.body;
    console.log('Adding user:', name, email, password, phone);
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
    const sql = 'SELECT * FROM departments';
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
    const sql = 'SELECT * FROM properties';
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
    const sql = 'SELECT * FROM vendors';
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

const port = 5050;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
