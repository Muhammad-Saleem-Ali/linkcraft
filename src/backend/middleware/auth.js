import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_jwt_key_ilearner_2026_xyz';
export function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
    if (!token) {
        // Check if fallback cookie or default demo user
        req.user = undefined;
        return next();
    }
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            req.user = undefined;
            return next();
        }
        req.user = decoded;
        next();
    });
}
export function requireAuth(req, res, next) {
    authenticateToken(req, res, () => {
        if (!req.user) {
            // Default to Ahmar if testing locally or demo mode
            // But reject if unauthenticated
            return res.status(401).json({
                success: false,
                error: 'Authentication token required'
            });
        }
        next();
    });
}
export function requireAdmin(req, res, next) {
    authenticateToken(req, res, () => {
        if (!req.user) {
            return res.status(401).json({ success: false, error: 'Authentication required' });
        }
        if (req.user.role !== 'admin') {
            return res.status(403).json({ success: false, error: 'Admin access privileges required' });
        }
        next();
    });
}
export function generateToken(user) {
    return jwt.sign({ id: user.id, email: user.email, name: user.name, role: user.role }, JWT_SECRET, { expiresIn: '30d' });
}
