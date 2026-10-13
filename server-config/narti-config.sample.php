<?php
/* NARTI server settings - TEMPLATE
   1. Copy this file OUTSIDE the website folder, one level up, and name it narti-config.php
      Example: if the website lives in /home/carpente/nartiairconservice.com/
               put the file at   /home/carpente/narti-config.php
   2. Fill in the values below. Never upload the filled file to GitHub. */

return [
    // MySQL details from cPanel > MySQL Databases
    'db_host' => 'localhost',
    'db_name' => 'carpente_narti_leads',   // full database name as cPanel shows it
    'db_user' => 'carpente_narti_user',    // full database user as cPanel shows it
    'db_pass' => 'PUT-THE-DATABASE-PASSWORD-HERE',

    // Password for the leads page: https://nartiairconservice.com/leads/
    // Use at least 12 characters. It is different from the database password.
    'admin_password' => 'PUT-A-STRONG-LEADS-PAGE-PASSWORD-HERE',

    // Email sending (recommended). Create the mailbox in cPanel > Email Accounts first.
    'smtp_host' => 'mail.nartiairconservice.com',
    'smtp_port' => 465,
    'smtp_user' => 'info@nartiairconservice.com',
    'smtp_pass' => 'PUT-THE-MAILBOX-PASSWORD-HERE',
    'smtp_from' => 'info@nartiairconservice.com',
    'notify_email' => 'shujaatshakeeb26@gmail.com, nartirani42@gmail.com',   // one or more, comma-separated
];
