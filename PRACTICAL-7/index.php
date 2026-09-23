<?php
$errors = [];
$successMessage = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name    = trim($_POST['fullname'] ?? $_POST['name'] ?? '');
    $email   = filter_var(trim($_POST['email'] ?? ''), FILTER_SANITIZE_EMAIL);
    $mobile  = trim($_POST['mobile'] ?? '');
    $course  = trim($_POST['course'] ?? '');
    $year    = trim($_POST['year'] ?? '');
    $gender  = trim($_POST['gender'] ?? '');

    if (empty($name)) {
        $errors[] = 'Name is required.';
    } elseif (strlen($name) < 2) {
        $errors[] = 'Name must be at least 2 characters.';
    }

    if (empty($email)) {
        $errors[] = 'Email is required.';
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors[] = 'Please provide a valid email address.';
    }

    if (empty($mobile)) {
        $errors[] = 'Mobile number is required.';
    }

    if (empty($course)) {
        $errors[] = 'Course is required.';
    }

    if (empty($year)) {
        $errors[] = 'Year of study is required.';
    }

    if (empty($gender)) {
        $errors[] = 'Gender is required.';
    }

    if (empty($errors)) {
        $timestamp = date('Y-m-d H:i:s');
        $csvFile   = __DIR__ . '/student_registrations.csv';
        $isNewFile = !file_exists($csvFile);

        $fileHandle = @fopen($csvFile, 'a');
        if ($fileHandle && flock($fileHandle, LOCK_EX)) {
            if ($isNewFile) {
                fputcsv($fileHandle, ['Timestamp', 'Name', 'Email', 'Mobile', 'Course', 'Year', 'Gender']);
            }
            fputcsv($fileHandle, [$timestamp, $name, $email, $mobile, $course, $year, $gender]);
            flock($fileHandle, LOCK_UN);
            fclose($fileHandle);
            $successMessage = 'Thank you! Your submission has been saved.';
            
            $name = $email = $mobile = $course = $year = $gender = '';
        } else {
            $errors[] = 'Could not write to storage. Check file permissions.';
        }
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Contact & Registration</title>
    <style>
        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, sans-serif;
        }

        body {
            background-color: #f1f5f9;
            color: #1e293b;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            padding: 24px;
        }

        .card {
            background: #ffffff;
            width: 100%;
            max-width: 480px;
            padding: 32px;
            border-radius: 12px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.05);
        }

        h2 {
            font-size: 1.5rem;
            font-weight: 600;
            margin-bottom: 8px;
            color: #0f172a;
        }

        p.subtitle {
            font-size: 0.875rem;
            color: #64748b;
            margin-bottom: 24px;
        }

        .alert {
            padding: 12px 16px;
            border-radius: 8px;
            font-size: 0.875rem;
            margin-bottom: 20px;
        }

        .alert-error {
            background-color: #fef2f2;
            border: 1px solid #fecaca;
            color: #991b1b;
        }

        .alert-error ul {
            padding-left: 18px;
        }

        .alert-success {
            background-color: #f0fdf4;
            border: 1px solid #bbf7d0;
            color: #166534;
        }

        .form-group {
            margin-bottom: 18px;
        }

        label {
            display: block;
            font-size: 0.875rem;
            font-weight: 500;
            margin-bottom: 6px;
            color: #334155;
        }

        input[type="text"],
        textarea {
            width: 100%;
            padding: 10px 14px;
            border: 1px solid #cbd5e1;
            border-radius: 6px;
            font-size: 0.95rem;
            color: #0f172a;
            outline: none;
            transition: border-color 0.2s, box-shadow 0.2s;
        }

        input[type="text"]:focus,
        textarea:focus {
            border-color: #2563eb;
            box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
        }

        textarea {
            resize: vertical;
            min-height: 110px;
        }

        button[type="submit"] {
            width: 100%;
            padding: 12px;
            background-color: #2563eb;
            color: #ffffff;
            border: none;
            border-radius: 6px;
            font-size: 0.95rem;
            font-weight: 600;
            cursor: pointer;
            transition: background-color 0.2s;
        }

        button[type="submit"]:hover {
            background-color: #1d4ed8;
        }

        button[type="submit"]:active {
            background-color: #1e40af;
        }
    </style>
</head>
<body>

    <div class="card">
        <h2>Registration Form</h2>
        <p class="subtitle">Your registration has been received.</p>

        <!-- Feedback Banners -->
        <?php if (!empty($errors)): ?>
            <div class="alert alert-error">
                <ul>
                    <?php foreach ($errors as $error): ?>
                        <li><?= htmlspecialchars($error, ENT_QUOTES, 'UTF-8') ?></li>
                    <?php endforeach; ?>
                </ul>
            </div>
        <?php endif; ?>

        <?php if ($successMessage): ?>
            <div class="alert alert-success">
                <?= htmlspecialchars($successMessage, ENT_QUOTES, 'UTF-8') ?>
            </div>
        <?php endif; ?>

        <p><a href="http://localhost:5500/register.html">Back to registration</a></p>
    </div>

</body>
</html>