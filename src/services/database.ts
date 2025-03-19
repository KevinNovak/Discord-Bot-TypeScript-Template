import pg from 'pg'
const { Pool } = pg

const pool = new Pool({
    user: 'postgres',  // Remplace par ton utilisateur PostgreSQL
    host: 'localhost',         // Remplace par l'IP ou le host si distant
    database: 'nomaskdb',      // Nom de ta base de données
    password: '9_7,*4<)@&t3GFcpku:z)F?75[1c!U',  // Mot de passe de ton utilisateur PostgreSQL
    port: 5432,                // Port de PostgreSQL (par défaut 5432)
});

export default pool;
