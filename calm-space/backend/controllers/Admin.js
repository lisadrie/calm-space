const client = require('../db');
const Users = require('../models/Users');
const Admins = require('../models/Admins');
const SuperAdmins = require('../models/SuperAdmins');
const Moderators = require('../models/Moderators');

const resolveRole = async (userId) => {
    const [superAdmin, admin, moderator] = await Promise.all([
        SuperAdmins.selectByUserID(userId),
        Admins.selectByUserID(userId),
        Moderators.selectByUserID(userId),
    ]);
    if (superAdmin) return 'Super Admin';
    if (admin) return 'Admin';
    if (moderator) return 'Modérateur';
    return 'Utilisateur';
};

const getStats = async (req, res) => {
    try {
        const [total, active, inactive, emotions, stress, newWeek] = await Promise.all([
            client.query('SELECT COUNT(*) FROM users'),
            client.query('SELECT COUNT(*) FROM users WHERE active = true'),
            client.query('SELECT COUNT(*) FROM users WHERE active = false'),
            client.query('SELECT COUNT(*) FROM emotions'),
            client.query('SELECT COUNT(*) FROM stress_assessments'),
            client.query("SELECT COUNT(*) FROM users WHERE created >= NOW() - INTERVAL '7 days'"),
        ]);
        res.status(200).json({
            totalUsers:    parseInt(total.rows[0].count),
            activeUsers:   parseInt(active.rows[0].count),
            inactiveUsers: parseInt(inactive.rows[0].count),
            totalEmotions: parseInt(emotions.rows[0].count),
            totalStress:   parseInt(stress.rows[0].count),
            newUsersWeek:  parseInt(newWeek.rows[0].count),
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const [users, admins, superAdmins, moderators] = await Promise.all([
            Users.selectAll(),
            Admins.selectAll(),
            SuperAdmins.selectAll(),
            Moderators.selectAll(),
        ]);
        const saSet  = new Set((superAdmins  || []).map(r => r.user_id));
        const aSet   = new Set((admins       || []).map(r => r.user_id));
        const modSet = new Set((moderators   || []).map(r => r.user_id));

        const withRoles = (users || []).map(u => {
            let role = 'Utilisateur';
            if (saSet.has(u.id))  role = 'Super Admin';
            else if (aSet.has(u.id))   role = 'Admin';
            else if (modSet.has(u.id)) role = 'Modérateur';
            return { ...u, role };
        });
        res.status(200).json(withRoles);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const activateUser = async (req, res) => {
    try {
        const user = await Users.active(req.params.id);
        res.status(200).json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const deactivateUser = async (req, res) => {
    try {
        const user = await Users.deactive(req.params.id);
        res.status(200).json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        const isSA = await SuperAdmins.selectByUserID(id);
        if (isSA) return res.status(403).json({ message: 'Impossible de supprimer un Super Admin.' });
        const user = await Users.remove(id);
        res.status(200).json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const changeRole = async (req, res) => {
    const { id } = req.params;
    const { role } = req.body;
    const allowed = ['Utilisateur', 'Admin', 'Modérateur'];
    if (!allowed.includes(role)) return res.status(400).json({ message: 'Rôle invalide.' });
    try {
        const isSA = await SuperAdmins.selectByUserID(id);
        if (isSA) return res.status(403).json({ message: 'Impossible de modifier le rôle d\'un Super Admin.' });
        await Promise.allSettled([Admins.remove(id), Moderators.remove(id)]);
        if (role === 'Admin') await Admins.create(id);
        else if (role === 'Modérateur') await Moderators.create(id);
        res.status(200).json({ message: 'Rôle mis à jour.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const getActivity = async (req, res) => {
    try {
        const [regRows, emoRows, emoBreakdown, adminsAll, superAdminsAll, moderatorsAll, totalRows] = await Promise.all([
            client.query(`
                SELECT TO_CHAR(DATE(created), 'DD/MM') AS day, COUNT(*)::int AS count
                FROM users
                WHERE created >= NOW() - INTERVAL '14 days'
                GROUP BY DATE(created)
                ORDER BY DATE(created) ASC
            `),
            client.query(`
                SELECT TO_CHAR(DATE(logged_at), 'DD/MM') AS day, COUNT(*)::int AS count
                FROM emotions
                WHERE logged_at >= NOW() - INTERVAL '14 days'
                GROUP BY DATE(logged_at)
                ORDER BY DATE(logged_at) ASC
            `),
            client.query(`
                SELECT emotion, COUNT(*)::int AS count
                FROM emotions
                GROUP BY emotion
                ORDER BY count DESC
                LIMIT 8
            `),
            client.query('SELECT COUNT(*)::int AS count FROM admins'),
            client.query('SELECT COUNT(*)::int AS count FROM super_admins'),
            client.query('SELECT COUNT(*)::int AS count FROM moderators'),
            client.query('SELECT COUNT(*)::int AS count FROM users'),
        ]);

        const adminCount     = adminsAll.rows[0].count;
        const superAdminCount= superAdminsAll.rows[0].count;
        const moderatorCount = moderatorsAll.rows[0].count;
        const totalCount     = totalRows.rows[0].count;
        const utilisateurCount = totalCount - adminCount - superAdminCount - moderatorCount;

        res.status(200).json({
            dailyRegistrations: regRows.rows,
            dailyEmotions:      emoRows.rows,
            emotionBreakdown:   emoBreakdown.rows,
            rolesBreakdown: [
                { role: 'Super Admin', count: superAdminCount },
                { role: 'Admin',       count: adminCount },
                { role: 'Modérateur',  count: moderatorCount },
                { role: 'Utilisateur', count: utilisateurCount },
            ],
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = { getStats, getActivity, getAllUsers, activateUser, deactivateUser, deleteUser, changeRole };
