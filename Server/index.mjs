import mongoose from "mongoose";

const someAsyncOperation = () => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve('Success');
        }, 1000);
    });
};

mongoose.connect("mongodb+srv://ipowertree:nP0d1pAEWVXpXYoK@imagine.onigxmo.mongodb.net/?retryWrites=true&w=majority&appName=imagine", { useNewUrlParser: true, useUnifiedTopology: true});
someAsyncOperation()
    .then(() => {
        console.log("mongodb connected");
    })
    .catch(() => {
        console.log("failed");
    });

const newSchema = new mongoose.Schema({
    uid: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String
    },
    position: {
        type: String
    }
});

const collectiona = mongoose.model("admins", newSchema);

const employeeSchema = new mongoose.Schema({
    uid: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String},
    department: { type: String},
    dob: { type: String},
    joiningDate: { type: String },
    salary: { type: Number},
    address: { type: String}
});

const individualAttendanceSchema = new mongoose.Schema({
    uid: { type: String, required: true },
    present: { type: Boolean },
    absent: { type: Boolean },
    leave: { type: Boolean },
  }, { _id: false });
  
  // Define the main attendance schema
  const attendanceSchema = new mongoose.Schema({
    year: { type: Number, required: true },
    month: { type: Number, required: true },
    date: { type: Number, required: true },
    day: { type: String, required: true },
    data: {
      type: Map,
      of: individualAttendanceSchema,
      required: true,
    },
  });

  //define the leave schema
  const leaveSchema = new mongoose.Schema({
    uid: { type: String, required: true },
    leaveType: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    reason: { type: String, required: true },
    totalDays: { type: Number, required: true }, 
    status: { type: String, required: true, default: "Pending" },
    review: { type: String},
    leavePaymentType: { type: String}, // Add this field
  });
  
  const taskSchema = new mongoose.Schema({
    uid: String,
    task: String,
    description: String,
    deadline: Date,
    status: { type: String, default: "Pending" }
  });

  const ReimbursementSchema = new mongoose.Schema({
    uid: { type: String, required: true },
    expenseType: { type: String, required: true },
    description: { type: String },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    proofs: { type: [String], required: true },
    vehicleType: { type: String },
    totalKms: { type: Number },
    totalExpense: { type: Number },
    gstType: { type: String, required: true },
    status: { type: String, default: "Pending" },
    review: { type: String} 
  });

  const clientSchema = new mongoose.Schema({
    uid: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    clientType: { type: String, required: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String},
    locationLink: { type: String }    
  });

  const clientDocumentSchema = new mongoose.Schema({
    uid: {
      type: String,
      required: true
    },
    documentName: {
      type: String,
      required: true
    },
    uploadDate: {
      type: Date,
      default: Date.now,
    },
    docs:{
      type: [String],
      required: true
    }
  });
  

  const overtimeSchema = new mongoose.Schema({
    uid: { type: String, required: true },
    date: { type: Date, required: true },
    hours: { type: Number, required: true },
    description: { type: String, required: true }
  });
  

  

const collectionc = mongoose.model("clients", clientSchema);





const collectione = mongoose.model("employees", employeeSchema);

export { collectiona, collectionc, collectione, employeeSchema, attendanceSchema,taskSchema,leaveSchema,ReimbursementSchema,clientSchema,clientDocumentSchema,overtimeSchema};

