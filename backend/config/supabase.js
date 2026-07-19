const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

console.log("URL:", process.env.SUPABASE_URL);
console.log(
    "Key starts with:",
    process.env.SUPABASE_SERVICE_ROLE_KEY?.substring(0, 25)
);
console.log(
    "Key length:",
    process.env.SUPABASE_SERVICE_ROLE_KEY?.length
);

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

module.exports = supabase;