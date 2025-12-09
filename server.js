import express from "express";
import 'dotenv/config'; 
import cors from "cors";
import path from "path";
import UserRoutes from "./routers/UserRoutes.js"; 
import CustomerAmRoutes from "./routers/customer/CustomerAmRoutes.js";
import CustomerFeedbackRoutes from "./routers/customer/CustomerFeedbackRoutes.js";
import OwnerAmenityRoutes from "./routers/owner/ownerAmenityRoutes.js"; 
import ownerDashboardRoutes from './routers/owner/ownerDashboardRoutes.js';
import transactionRoutes from './routers/TransactionRoutes.js';
import reservationRoutes from './routers/ReservationRoutes.js';

const app = express();


function validateRouteFile(routeName, router) {
    const routerStack = router.stack || router._router?.stack || [];
    
    routerStack.forEach((layer) => {
        if (layer.route) {
            const path = layer.route.path;
            if (path.includes(':*') || path.includes('::')) {
                console.error(`❌ INVALID ROUTE FOUND: ${path}`);
                console.error(`   File: ${routeName}`);
                throw new Error(`Invalid route syntax in ${routeName}: ${path}`);
            }
        }
    });
}


const corsOptions = {
    origin: (origin, callback) => {
        const allowedOrigins = [
            "http://localhost:5173", 
            "http://localhost:5174", 
            "http://127.0.0.1:5173", 
            process.env.CLIENT_URL, 
            process.env.ORIGIN
        ];
        
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            console.log("🚫 Blocked by CORS:", origin);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true, 
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
};

app.use(express.json({ limit: '10mb' })); 
app.use(cors(corsOptions)); 

app.use('/uploads/am_images', express.static(path.join(process.cwd(), 'uploads', 'am_images')));

app.use((req, res, next) => {
    console.log(`📝 ${req.method} ${req.originalUrl}`);
    next();
});

try {
    validateRouteFile('UserRoutes (Auth)', UserRoutes);
    validateRouteFile('CustomerAmRoutes', CustomerAmRoutes);
    validateRouteFile('CustomerFeedbackRoutes', CustomerFeedbackRoutes);
    validateRouteFile('OwnerAmenityRoutes', OwnerAmenityRoutes);
    validateRouteFile('ownerDashboardRoutes', ownerDashboardRoutes);
    validateRouteFile('transactionRoutes', transactionRoutes);
    validateRouteFile('reservationRoutes', reservationRoutes);
} catch (error) {
    console.error('\n❌ ROUTE VALIDATION ERROR:');
    console.error(error.message);
    process.exit(1); 
}

app.use('/api/auth', UserRoutes);
app.use('/api/amenities', CustomerAmRoutes);  
app.use('/api/feedbacks', CustomerFeedbackRoutes);

//Owner Dashboard & Management
app.use('/api/owner/amenities', OwnerAmenityRoutes);
app.use('/api/owner', ownerDashboardRoutes); 

//Transactions & Reservations
app.use('/api/transactions', transactionRoutes);
app.use('/api/reservations', reservationRoutes);

//System Health Check
app.get('/api/health', (req, res) => {
    res.json({ 
        success: true, 
        message: 'IRMS API is running!',
        uptime: process.uptime()
    });
});

// Root Route
app.get('/', (req, res) => {
    res.json({ message: 'IRMS Server is running. Access API at /api/...' });
});


// ERROR HANDLING
app.use((err, req, res, next) => {
    console.error(`❌ ERROR: ${err.message}`);
    
    res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
    });
});

try {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`\n🚀 Server running on port ${PORT}`);
        console.log(`🔗 Health Check: http://localhost:${PORT}/api/health`);
    });
} catch (e) {
    console.log('\n❌ SERVER STARTUP ERROR:', e);
}