import express, { json, urlencoded } from "express";
import multer from "multer";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { google } from "googleapis";
import { Readable } from 'stream';
import path from 'path';
import fs from 'fs/promises';
import cors from "cors";



import {uploadFileToDrive, authorize } from "./googleDrive.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Serve static files from the EMS directory
app.use(express.static(path.join(__dirname, '../EMS')));

app.get('/api', (req, res) => {
  res.send('API endpoint');
});

// All other routes should serve the index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../EMS/index.html'));
});




import mongoose from "mongoose";
import { collectiona, collectionc, collectione, employeeSchema, attendanceSchema,taskSchema,leaveSchema,ReimbursementSchema,clientSchema,clientDocumentSchema, overtimeSchema} from "./index.mjs";

const employees = mongoose.model("employees", employeeSchema);
const attendance = mongoose.model('attendance', attendanceSchema);
const Task = mongoose.model('Task', taskSchema);
const Leave = mongoose.model('Leave', leaveSchema);
const Reimbursement = mongoose.model('Reimbursement', ReimbursementSchema);

const Client = mongoose.model('Client', clientSchema);
const ClientDocument = mongoose.model('ClientDocument', clientDocumentSchema);
const Overtime = mongoose.model('Overtime',overtimeSchema);




const app = express();
app.use(json());
app.use(urlencoded({ extended: true }));

const corsOptions = {
  origin: 'https://ipower.vercel.app', // Replace with your frontend origin
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH', 'HEAD', 'CONNECT'], // Specify the methods you want to allow
  allowedHeaders: ['Content-Type', 'Authorization', 'Access-Control-Allow-Origin'], // Include necessary headers
  exposedHeaders: ['Access-Control-Allow-Origin'], // Ensure the header is exposed
  credentials: true
};

app.use(cors(corsOptions));

// Explicitly handle preflight requests
app.options('*', cors(corsOptions)); // Preflight request for all routes



// app.use(cors({
//   origin: 'https://ipower.vercel.app', // or '*' to allow all origins
//   methods: ['GET', 'POST', 'DELETE', 'PUT', 'OPTIONS', 'PATCH', 'HEAD', 'CONNECT'],
//   allowedHeaders: ['Content-Type', 'Authorization'],
//   credentials: true,
// }));

// app.use((req, res, next) => {
//   res.header('Access-Control-Allow-Origin', 'https://ipower.vercel.app');
//   res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
//   res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
//   next();
// });


// app.use((req, res, next) => {
//   res.cookie('token', 'your-token-value', {
//     httpOnly: true,
//     secure: true, // Set to true if using HTTPS
//     sameSite: 'None'
//   });
//   next();
// });


app.get("/login", (req,res) => {
  res.status(200).json({message: "Login Page"});
});

app.post("/login", (req, res) => {
const { role } = req.body;
res.status(200).json({ message: `Logged in as ${role}` });
});

app.post('/loginforma', async (req, res) => {
  try {
      const { uid, password } = req.body;
      const user = await collectiona.findOne({ uid, password }).lean();
      if (user) {
          res.json({ status: 'success', message: 'Login successful' });
      } else {
          res.status(401).json({ status: 'error', message: 'Invalid UID or password' });
      }
  } catch (err) {
      res.status(500).json(err);
  }
});

app.post('/loginforme', async (req, res) => {
  try {
      const { uid, password } = req.body;
      const user = await collectione.findOne({ uid, password }).lean();
      if (user) {
          res.json({ status: 'success', message: 'Login successful' });
      } else {
          res.status(401).json({ status: 'error', message: 'Invalid UID or password' });
      }
  } catch (err) {
      res.status(500).json(err);
  }
});

app.post('/loginformc', async (req, res) => {
  try {
      const { uid, password } = req.body;
      const user = await collectionc.findOne({ uid, password }).lean();
      if (user) {
          res.json({ status: 'success', message: 'Login successful' });
      } else {
          res.status(401).json({ status: 'error', message: 'Invalid UID or password' });
      }
  } catch (err) {
      res.status(500).json(err);
  }
});


app.get("/admins", async (req, res) => {
    try {
        const data = await collectiona.find({}, 'uid password name position').lean();
        res.json(data);
    } catch (err) {
        res.status(500).json(err);
    }
});



app.get("/employees", async (req, res) => {
    try {
        const data = await collectione.find({}, 'uid password name phone email department dob joiningDate salary address').sort({uid: 1}).lean();
  
        res.json(data);
    } catch (err) {
        res.status(500).json(err);
    }
  });

  app.get('/employees/:uid', async (req, res) => {
    const { uid } = req.params;
    try {
      const employee = await collectione.findOne({ uid }).lean();
      if (!employee) {
        return res.status(404).json({ message: 'Employee not found' });
      }
      res.json(employee);
    } catch (err) {
      res.status(500).json(err);
    }
  });

  app.put('/employees/:uid', async (req, res) => {
    const { uid } = req.params;
    const updatedData = req.body;
  
    try {
      const employee = await collectione.findOneAndUpdate({ uid }, updatedData, { new: true });
  
      if (!employee) {
        return res.status(404).json({ message: 'Employee not found' });
      }
  
      res.status(200).json(employee);
    } catch (error) {
      res.status(500).json({ message: 'Error updating employee', error });
    }
  });

  

  app.delete('/employees/:uid', async (req, res) => {
    const { uid } = req.params;
  
    try {
      const employee = await collectione.findOneAndDelete({ uid });
  
      if (!employee) {
        return res.status(404).json({ message: 'Employee not found' });
      }
  
      res.status(200).json({ message: 'Employee deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting employee', error });
    }
  });
  

// app.post("/loginforma", async (req, res) => {
//     const { uid, password } = req.body;

//     try {
//         const check = await collectiona.findOne({ uid: uid });

//         if (check) {
//             res.json("exist");
//         } else {
//             res.json("notexist");
//         }
//     } catch (e) {
//         res.json("notexist");
//     }
// });

// app.post("/loginformc", async (req, res) => {
//   const { uid, password } = req.body;

//   try {
//       const check = await collectionc.findOne({ uid: uid });

//       if (check) {
//           res.json("exist");
//       } else {
//           res.json("notexist");
//       }
//   } catch (e) {
//       res.json("notexist");
//   }
// });

// app.post("/loginforme", async (req, res) => {
//   const { uid, password } = req.body;

//   try {
//       const check = await collectione.findOne({ uid: uid });

//       if (check) {
//           res.json("exist");
//       } else {
//           res.json("notexist");
//       }
//   } catch (e) {
//       res.json("notexist");
//   }
// });

app.post("/addempa", async (req, res) => {
    const { uid, password, name, phone, email, department, dob, joiningDate, salary, address } = req.body;

    try {
        const newEmployee = new employees({
            uid,
            password,
            name,
            phone,
            email,
            department,
            dob,
            joiningDate,
            salary,
            address
        });

        await newEmployee.save();
        res.json({ message: "Employee added successfully" });
    } catch (err) {
        res.status(500).json({ message: "Error adding employee", error: err });
    }
});

app.post('/attendance', async (req, res) => {
        const { year, month, date, day, data } = req.body;
    
        try {
            const newAttendance = new attendance({
                year,
                month,
                date,
                day,
                data
            });
    
            await newAttendance.save();
            res.status(200).send('Attendance recorded successfully');
        } catch (err) {
            res.status(500).json({ message: "Error recording attendance", error: err });
        }
    });

    app.get("/attendance", async (req, res) => {
        try {
          const data = await Attendance.find({}, 'data').lean();
          res.json(data);
        } catch (err) {
          res.status(500).json(err);
        }
      });
    
      app.get('/attendance/:uid', async (req, res) => {
        const { uid } = req.params;
      
        try {
          const employeeAttendance = await attendance.find({ [`data.${uid}`]: { $exists: true } })
            .sort({ year: -1, month: -1, date: -1 })  // Sorting by year, month, and date in descending order
            .lean();
      
          if (employeeAttendance.length === 0) {
            return res.status(404).json({ message: "No attendance records found for the given UID" });
          }
      
          res.status(200).json(employeeAttendance);
        } catch (err) {
          console.error("Error fetching attendance:", err);
          res.status(500).json({ message: "Error fetching attendance", error: err });
        }
      });

      app.get('/attendance/:year/:month/:date', async (req, res) => {
        const { year, month, date } = req.params;
      
        try {
          const attendanceRecords = await attendance.find({ year, month, date }).lean();
          res.status(200).json(attendanceRecords);
        } catch (err) {
          console.error("Error fetching attendance records:", err);
          res.status(500).json({ message: "Error fetching attendance records", error: err });
        }
      });

      app.put('/attendance/:year/:month/:date', async (req, res) => {
        const { year, month, date } = req.params;
        const updatedAttendance = req.body;
        try {
          await attendance.findOneAndUpdate(
            { year, month, date },
            updatedAttendance,
            { new: true }
          );
          res.json({ message: 'Attendance updated successfully' });
        } catch (error) {
          res.status(500).json({ message: 'Error updating attendance' });
        }
      });
      
      

      app.get('/attendance/monthly/:uid/:year/:month', async (req, res) => {
        const { uid, year, month } = req.params;
        try {
          const attendanceRecords = await attendance.find({ year, month });
          const monthlyAttendance = attendanceRecords.map(record => ({
            date: record.date,
            present: record.data.get(uid)?.present || false,
            absent: record.data.get(uid)?.absent || false,
            leave: record.data.get(uid)?.leave || false
          }));
          res.json(monthlyAttendance);
        } catch (error) {
          res.status(500).send(error);
        }
      });


      app.get('/attendance/:year/:month/employee/:uid', async (req, res) => {
        const { year, month, uid } = req.params;
        try {
          const attendanceRecords = await attendance.aggregate([
            {
              $match: {
                year: parseInt(year),
                month: parseInt(month),
                [`data.${uid}`]: { $exists: true }
              }
            },
            {
              $project: {
                date: 1,
                day: 1,
                status: `$data.${uid}`
              }
            },
            {
              $sort: {
                date: 1 // Ensure the records are sorted by date
              }
            }
          ]);
      
          res.json(attendanceRecords);
        } catch (error) {
          console.error('Error fetching attendance records:', error);
          res.status(500).json({ error: 'Internal server error' });
        }
      });
      
    
   

    app.post("/tasks", async (req, res) => {
      try {
        const { tasks } = req.body;
        const task = tasks[0]; // Since tasks array contains only one task
        const newTask = new Task(task);
        await newTask.save();
        res.status(201).send("Task assigned successfully!");
      } catch (error) {
        res.status(500).send("Error assigning task:", error.message);
      }
    });
    
    app.get("/tasks", async (req, res) => {
      const { status } = req.query;
      try {
        const tasks = await Task.find(status ? { status } : {}).sort({ deadline: 1 });
        res.json(tasks);
      } catch (error) {
        res.status(500).send("Error fetching tasks:", error);
      }
    });

    app.get("/tasks/:uid", async (req, res) => {
      try {
        const tasks = await Task.find({ uid: req.params.uid }).sort({ deadline: 1 });
        res.status(200).json({ tasks });
      } catch (error) {
        res.status(500).json({ error: "Error fetching tasks" });
      }
    });
    
    // Update task status
    app.post("/tasks/:taskId/status", async (req, res) => {
      try {
        const { status } = req.body;
        await Task.findByIdAndUpdate(req.params.taskId, { status });
        res.status(200).send("Task status updated successfully");
      } catch (error) {
        res.status(500).json({ error: "Error updating task status" });
      }
    });

    app.delete("/tasks/:id", async (req, res) => {
      try {
        const taskId = req.params.id;
        await Task.findByIdAndDelete(taskId);
        res.status(200).send("Task deleted successfully!");
      } catch (error) {
        res.status(500).send("Error deleting task:", error);
      }
    });
    
    app.post('/submit-leave', async (req, res) => {
      try {
        console.log("Received Data:", req.body);  // Log received data
        const leaveData = new Leave(req.body);
        await leaveData.save();
        res.status(201).send(leaveData);
      } catch (error) {
        console.error("Error saving leave data:", error);
        res.status(400).send({ message: 'Error saving leave data', error });
      }
    });  
    
    app.get('/leaves', async (req, res) => {
      try {
        const leaves = await Leave.find().sort({ endDate: -1 });
        const leavesWithNames = await Promise.all(leaves.map(async leave => {
          const employee = await employees.findOne({ uid: leave.uid });
          return { ...leave.toObject(), name: employee ? employee.name : 'Unknown' };
        }));
        res.json(leavesWithNames);
      } catch (error) {
        res.status(500).send(error.message);
      }
    });

    app.get('/leaves/:uid', async (req, res) => {
      try {
        const { uid } = req.params;
        const leaves = await Leave.find({ uid }).sort({ endDate: -1 });
        res.json(leaves);
      } catch (error) {
        res.status(500).send(error.message);
      }
    });

    // app.delete('/leaves/:id', async (req, res) => {
    //   try {
    //     const { id } = req.params;
    //     await Leave.findByIdAndDelete(id);
    //     res.status(200).send({ message: 'Leave application deleted successfully' });
    //   } catch (error) {
    //     res.status(500).send(error.message);
    //   }
    // });

    // app.patch('/leaves/:id/status', async (req, res) => {
    //   try {
    //     const { id } = req.params;
    //     const { status } = req.body;
    //     await Leave.findByIdAndUpdate(id, { status });
    //     res.status(200).send({ message: 'Leave application status updated successfully' });
    //   } catch (error) {
    //     res.status(500).send(error.message);
    //   }
    // });

    app.get('/leave/:id', async (req, res) => {
      try {
        const leave = await Leave.findById(req.params.id);
        if (!leave) {
          return res.status(404).send({ message: 'Leave application not found' });
        }
        res.send(leave);
      } catch (error) {
        res.status(500).send({ message: 'Server error' });
      }
    });
    
    
    
    app.patch('/leaves/:id/status', async (req, res) => {
      try {
        const { status, review, leavePaymentType } = req.body;
        const leave = await Leave.findById(req.params.id);
        if (!leave) {
          return res.status(404).json({ message: "Leave application not found" });
        }
        leave.status = status;
        leave.review = review;
        leave.leavePaymentType = leavePaymentType || leave.leavePaymentType; // Update leavePaymentType if provided
        await leave.save();
        res.status(200).json(leave);
      } catch (error) {
        res.status(500).json({ message: "Error updating leave status" });
      }
    });
    
    
    // Delete leave application
    app.delete('/leaves/:id', async (req, res) => {
      try {
        const leave = await Leave.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Leave application deleted successfully" });
      } catch (error) {
        res.status(500).json({ message: "Error deleting leave application" });
      }
    });
    


// app.use('/uploads', express.static('uploads'));

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'uploads/');
//   },
//   filename: (req, file, cb) => {
//     cb(null, `${Date.now()}-${file.originalname}`);
//   }
// });

// const upload = multer({ storage });

// app.post("/reimbursement", upload.array("proofs", 12), async (req, res) => {
//   try {
//     const {
//       uid,
//       expenseType,
//       description,
//       startDate,
//       endDate,
//       vehicleType,
//       totalKms,
//       totalExpense,
//       gstType,
//     } = req.body;

//     const proofs = req.files.map((file) => file.path);

//     const newReimbursement = new Reimbursement({
//       uid,
//       expenseType,
//       description,
//       startDate,
//       endDate,
//       proofs,
//       vehicleType,
//       totalKms,
//       totalExpense,
//       gstType, // Save GST type
//     });

//     await newReimbursement.save();
//     res.status(200).send("Reimbursement request submitted successfully");
//   } catch (error) {
//     console.error("Error submitting reimbursement request:", error);
//     res.status(500).send("Error submitting reimbursement request");
//   }
// });

// Configure multer to use memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

app.post('/reimbursement', upload.array('proofs', 12), async (req, res) => {
  try {
    const { uid, expenseType, description, startDate, endDate, vehicleType, totalKms, totalExpense, gstType } = req.body;

    const proofs = [];
    for (const file of req.files) {
      try {
        const driveLink = await uploadFileToDrive(file);
        proofs.push(driveLink);
      } catch (error) {
        console.error('Error uploading to Google Drive:', error);
        return res.status(500).send('Error uploading files to Google Drive');
      }
    }

    // Assuming you have a MongoDB or other database integration here to save reimbursement data
    // Example:
    const newReimbursement = new Reimbursement({
      uid,
      expenseType,
      description,
      startDate,
      endDate,
      proofs,
      vehicleType,
      totalKms,
      totalExpense,
      gstType,
    });
    await newReimbursement.save();

    res.status(200).send('Reimbursement request submitted successfully');
  } catch (error) {
    console.error('Error submitting reimbursement request:', error);
    res.status(500).send('Error submitting reimbursement request');
  }
});


app.get('/reimbursement/:uid', async (req, res) => {
  try {
    const { uid } = req.params;
    const reimbursements = await Reimbursement.find({ uid }).sort({ endDate: -1 });
    res.json(reimbursements);
  } catch (error) {
    console.error("Error fetching reimbursements:", error);
    res.status(500).json({ message: error.message });
  }
});

app.get('/reimbursements/:id', async (req, res) => {
  try {
    const reimbursement = await Reimbursement.findById(req.params.id).sort({ endDate: -1 });
    if (!reimbursement) {
      return res.status(404).json({ message: 'Reimbursement application not found' });
    }
    res.status(200).json(reimbursement);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching reimbursement application', error });
  }
});

// app.delete('/reimbursements/:id', async (req, res) => {
//   try {
//     const reimbursement = await Reimbursement.findById(req.params.id);
//     if (!reimbursement) {
//       console.error("Reimbursement not found:", req.params.id);
//       return res.status(404).send('Reimbursement not found');
//     }

//     console.log("Deleting reimbursement:", reimbursement);

//     // Delete the reimbursement entry
//     await Reimbursement.findByIdAndDelete(req.params.id);
//     console.log("Successfully deleted reimbursement");
//     res.status(200).send('Reimbursement deleted');
//   } catch (error) {
//     console.error("Error deleting reimbursement:", error);
//     res.status(500).send({ message: 'Internal Server Error', error: error.message });
//   }
// });


const auth = await authorize(); // Make sure to handle authorization globally or within a function
const drive = google.drive({ version: 'v3', auth });

async function deleteFileFromDrive(fileId) {
  try {
    await drive.files.delete({ fileId });
  } catch (error) {
    console.error('Error deleting file from Google Drive:', error);
    throw new Error('Error deleting file from Google Drive');
  }
}

app.delete('/reimbursements/:id', async (req, res) => {
  try {
    const reimbursement = await Reimbursement.findById(req.params.id);
    if (!reimbursement) {
      console.error("Reimbursement not found:", req.params.id);
      return res.status(404).send('Reimbursement not found');
    }

    console.log("Deleting reimbursement:", reimbursement);

    // Extract file IDs from proofs (assuming proofs contain Google Drive links)
    const proofLinks = reimbursement.proofs || [];
    const fileIds = proofLinks.map(link => {
      const matches = link.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
      return matches ? matches[1] : null;
    }).filter(id => id);

    // Delete files from Google Drive
    for (const fileId of fileIds) {
      await deleteFileFromDrive(fileId);
    }

    // Delete the reimbursement entry
    await Reimbursement.findByIdAndDelete(req.params.id);

    console.log("Successfully deleted reimbursement and associated files");
    res.status(200).send('Reimbursement deleted');
  } catch (error) {
    console.error("Error deleting reimbursement:", error);
    res.status(500).send({ message: error.message });
  }
});




app.get('/reimbursements', async (req, res) => {
  try {
    const reimbursements = await Reimbursement.find().sort({ endDate: -1 });
    const employeeData = await employees.find();

    const reimbursementsWithEmployeeName = reimbursements.map((reimbursement) => {
      const employee = employeeData.find(emp => emp.uid === reimbursement.uid);
      return {
        ...reimbursement._doc,
        employeeName: employee ? employee.name : 'Unknown',
      };
    });

    res.json(reimbursementsWithEmployeeName);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.patch('/reimbursements/:id/status', async (req, res) => {
  try {
    const { status, review } = req.body; // Get status and review from request body
    const reimbursement = await Reimbursement.findByIdAndUpdate(
      req.params.id,
      { status, review }, // Update status and review
      { new: true }
    );
    if (!reimbursement) {
      return res.status(404).send('Reimbursement not found');
    }
    res.status(200).send(reimbursement);
  } catch (error) {
    console.error("Error updating reimbursement status:", error);
    res.status(500).send({ message: error.message });
  }
});

// app.put('/reimbursements/:id', upload.array('proofs', 10), async (req, res) => {
//   try {
//     const {
//       uid,
//       expenseType,
//       description,
//       startDate,
//       endDate,
//       totalExpense,
//       gstType,
//       vehicleType,
//       totalKms,
//     } = req.body;

//     const existingProofs = req.body.existingProofs ? [].concat(req.body.existingProofs) : [];
//     const newProofs = req.files.map(file => file.path);

//     const updatedProofs = [...existingProofs, ...newProofs];

//     const updateData = {
//       uid,
//       expenseType,
//       description,
//       startDate,
//       endDate,
//       totalExpense,
//       gstType,
//       vehicleType: expenseType === 'fuel' ? vehicleType : '',
//       totalKms: expenseType === 'fuel' ? totalKms : '',
//       proofs: updatedProofs,
//     };

//     const updatedReimbursement = await Reimbursement.findByIdAndUpdate(
//       req.params.id,
//       updateData,
//       { new: true }
//     );

//     res.json(updatedReimbursement);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

app.put('/reimbursements/:id', upload.array('proofs', 10), async (req, res) => {
  try {
    const {
      uid,
      expenseType,
      description,
      startDate,
      endDate,
      totalExpense,
      gstType,
      vehicleType,
      totalKms,
    } = req.body;

    const existingProofs = req.body.existingProofs ? [].concat(req.body.existingProofs) : [];
    const newProofs = req.files.map(file => file);

    // Array to store Google Drive webViewLinks for proofs
    const proofLinks = [];

    // Upload new proofs to Google Drive
    for (const file of newProofs) {
      const webViewLink = await uploadFileToDrive(file); // Assuming uploadFileToDrive returns webViewLink
      proofLinks.push(webViewLink);
    }

    // Combine existing proofs with new webViewLinks
    const updatedProofs = [...existingProofs, ...proofLinks];

    const updateData = {
      uid,
      expenseType,
      description,
      startDate,
      endDate,
      totalExpense,
      gstType,
      vehicleType: expenseType === 'fuel' ? vehicleType : '',
      totalKms: expenseType === 'fuel' ? totalKms : '',
      proofs: updatedProofs,
    };

    const updatedReimbursement = await Reimbursement.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.json(updatedReimbursement);
  } catch (error) {
    console.error('Error updating reimbursements:', error);
    res.status(500).json({ message: 'Error updating reimbursements' });
  }
});



app.post('/addclient', (req, res) => {
  const { uid, password, clientType, name, phone, address, locationLink } = req.body;

  const newClient = new Client({
    uid,
    password,
    clientType,
    name,
    phone,
    address,
    locationLink
  });

  newClient.save()
    .then(client => res.json(client))
    .catch(err => res.status(400).json('Error: ' + err));
});

app.get('/clients', (req, res) => {
  Client.find().sort({ uid: 1 })
    .then(clients => res.json(clients))
    .catch(err => res.status(400).json('Error: ' + err));
});

app.get('/clients/:uid', async (req, res) => {
  try {
    const client = await Client.findOne({ uid: req.params.uid });
    if (!client) return res.status(404).send('Client not found');
    res.status(200).json(client);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Update a client by UID
app.put('/clients/:uid', async (req, res) => {
  try {
    const client = await Client.findOneAndUpdate({ uid: req.params.uid }, req.body, { new: true });
    if (!client) return res.status(404).send('Client not found');
    res.status(200).json(client);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Delete a client by UID
// app.delete('/clients/:uid', async (req, res) => {
//   try {
//     const client = await Client.findOneAndDelete({ uid: req.params.uid });
//     if (!client) return res.status(404).send('Client not found');
//     res.status(200).json({ message: 'Client deleted successfully' });
//   } catch (err) {
//     res.status(500).send(err);
//   }
// });


// app.use('/clientdocs', express.static('clientdocs'));

// const clientDocsStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'clientdocs/');
//   },
//   filename: (req, file, cb) => {
//     cb(null, `${Date.now()}-${file.originalname}`);
//   },
// });

// const clientDocsUpload = multer({ storage: clientDocsStorage });

// app.post('/clientDocuments/:uid/upload', clientDocsUpload.array('docs'), async (req, res) => {
//   try {
//     console.log('Files:', req.files);
//     console.log('Body:', req.body);

//     if (!req.files || req.files.length === 0) {
//       return res.status(400).json({ message: 'No files uploaded.' });
//     }

//     const { uid } = req.params;
//     const { documentName } = req.body;
//     const uploadDate = req.body.uploadDate || Date.now();
//     const docs = req.files.map(file => file.path);

//     const newClientDocument = new ClientDocument({
//       uid,
//       documentName,
//       uploadDate,
//       docs,
//     });

//     await newClientDocument.save();
//     res.status(200).json({ message: 'Document uploaded successfully', document: newClientDocument });
//   } catch (error) {
//     console.error('Server error:', error);
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// });


app.delete('/clients/:uid', async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const client = await Client.findOneAndDelete({ uid: req.params.uid }).session(session);
    if (!client) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).send('Client not found');
    }

    const clientDocuments = await ClientDocument.find({ uid: req.params.uid }).session(session);
    
    const fileIds = [];
    clientDocuments.forEach(doc => {
      const docFileIds = doc.docs.map(link => {
        const matches = link.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
        return matches ? matches[1] : null;
      }).filter(id => id);
      fileIds.push(...docFileIds);
    });

    for (const fileId of fileIds) {
      await deleteFileFromDrive(fileId);
    }

    await ClientDocument.deleteMany({ uid: req.params.uid }).session(session);

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({ message: 'Client and associated documents deleted successfully' });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    console.error('Error deleting client and documents:', err);
    res.status(500).send({ error: err.message });
  }
});

function getFileIdFromUrl(url) {
  const match = url.match(/\/file\/d\/([a-zA-Z0-9-_]+)\//);
  return match ? match[1] : null;
}


const clientDocsUpload = multer({ storage: multer.memoryStorage() });

app.post('/clientDocuments/:uid/upload', clientDocsUpload.array('docs'), async (req, res) => {
  try {
    console.log('Files:', req.files);
    console.log('Body:', req.body);

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded.' });
    }

    const { uid } = req.params;
    const { documentName } = req.body;
    const uploadDate = req.body.uploadDate || Date.now();

    const docs = [];
    for (const file of req.files) {
      try {
        const driveLink = await uploadFileToDrive(file);
        docs.push(driveLink);
      } catch (error) {
        console.error('Error uploading to Google Drive:', error);
        return res.status(500).send('Error uploading files to Google Drive');
      }
    }

    const newClientDocument = new ClientDocument({
      uid,
      documentName,
      uploadDate,
      docs,
    });

    await newClientDocument.save();
    res.status(200).json({ message: 'Document uploaded successfully', document: newClientDocument });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});




app.get('/clientDocuments/:uid', async (req, res) => {
  try {
    const { uid } = req.params;
    const documents = await ClientDocument.find({ uid });
    res.status(200).json(documents);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// app.delete('/clientDocuments/:uid/:docId', async (req, res) => {
//   try {
//     const { uid, docId } = req.params;
//     console.log(`Deleting document with ID: ${docId} for user: ${uid}`);

//     const document = await ClientDocument.findById(docId);

//     if (!document) {
//       console.error(`Document with ID: ${docId} not found.`);
//       return res.status(404).json({ message: 'Document not found' });
//     }

//     // Delete the document entry
//     await ClientDocument.deleteOne({ _id: docId });
//     console.log("Successfully deleted document");
//     res.status(200).json({ message: 'Document deleted successfully' });
//   } catch (err) {
//     console.error('Error deleting document:', err);
//     res.status(500).json({ message: 'Internal Server Error', error: err.message });
//   }
// });


app.delete('/clientDocuments/:uid/:docId', async (req, res) => {
  try {
    const { uid, docId } = req.params;
    const document = await ClientDocument.findById(docId);
    if (!document) {
            console.error(`Document with ID: ${docId} not found.`);
            return res.status(404).json({ message: 'Document not found' });
          }


    // Extract file IDs from proofs (assuming proofs contain Google Drive links)
    const docLinks = document.docs || [];
    const fileIds = docLinks.map(link => {
      const matches = link.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
      return matches ? matches[1] : null;
    }).filter(id => id);

    // Delete files from Google Drive
    for (const fileId of fileIds) {
      await deleteFileFromDrive(fileId);
    }
    await ClientDocument.deleteOne({ _id: docId });

    
    res.status(200).send('Document deleted');
  } catch (error) {
    console.error("Error deleting document:", error);
    res.status(500).send({ message: error.message });
  }
});




app.get('/overtime', async (req, res) => {
  try {
    const overtimeRecords = await Overtime.find();
    res.json(overtimeRecords);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching overtime data' });
  }
});

app.post('/overtime', async (req, res) => {
  const { uid, date, hours, description } = req.body;
  if (!uid || !date || !hours || !description) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const newOvertime = new Overtime({ uid, date, hours, description });
  try {
    const savedOvertime = await newOvertime.save();
    res.status(201).json(savedOvertime);
  } catch (error) {
    res.status(500).json({ message: 'Error adding overtime record' });
  }
});

// Get overtime records for a specific employee
app.get('/overtime/employee/:uid', async (req, res) => {
  try {
    const { uid } = req.params;
    const { year, month } = req.query;
    const query = { uid: uid };

    if (year && month) {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0);
      query.date = { $gte: startDate, $lte: endDate };
    }

    const overtimeRecords = await Overtime.find(query);
    res.json(overtimeRecords);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching overtime records' });
  }
});


// Fetch all employees
// app.get('/employees', async (req, res) => {
//   try {
//     const employees = await employees.find({}, { uid: 1, name: 1 }).lean();
//     res.json(employees);
//   } catch (error) {
//     console.error('Error fetching employees:', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// });

// Add a new overtime record
app.post('/overtime', async (req, res) => {
  const { uid, date, hours, description } = req.body;
  if (!uid || !date || !hours || !description) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const newOvertime = new Overtime({ uid, date, hours, description });
  try {
    await newOvertime.save();
    res.status(201).json({ message: 'Overtime record added successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error adding overtime record', error });
  }
});

// Delete an overtime record by ID
app.delete('/overtime/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedOvertime = await Overtime.findByIdAndDelete(id);
    if (!deletedOvertime) {
      return res.status(404).json({ message: 'Overtime record not found' });
    }
    res.json({ message: 'Overtime record deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting overtime record', error });
  }
});

// Update an overtime record by ID
app.put('/overtime/:id', async (req, res) => {
  const { id } = req.params;
  const { date, hours, description } = req.body;

  try {
    const updatedOvertime = await Overtime.findByIdAndUpdate(id, { date, hours, description }, { new: true });
    if (!updatedOvertime) {
      return res.status(404).json({ message: 'Overtime record not found' });
    }
    res.json({ message: 'Overtime record updated successfully', updatedOvertime });
  } catch (error) {
    res.status(500).json({ message: 'Error updating overtime record', error });
  }
});

app.get('/overtime/employee/:uid/month/:year/:month', async (req, res) => {
  try {
    const { uid, year, month } = req.params;
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const totalHours = await Overtime.aggregate([
      {
        $match: {
          uid: uid,
          date: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: null,
          totalHours: { $sum: '$hours' }
        }
      }
    ]);

    res.json({ totalHours: totalHours[0] ? totalHours[0].totalHours : 0 });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching total overtime hours' });
  }
});



app.listen(8001, () => {
    console.log("Server is running on port 8001");
});

