<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Access Your Bonuses</title>
        <?php
global $wpdb;

// Get current URL path
$current_path = trim(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH), '/');

// Split path and get the last segment (page slug)
$path_parts = explode('/', $current_path);
$page_slug = end($path_parts);

// Query the color hex using the slug
$color_hex = $wpdb->get_var(
    $wpdb->prepare(
        "SELECT color_hex FROM {$wpdb->prefix}Offer_Page_Data WHERE page_slug = %s LIMIT 1",
        $page_slug
    )
);

// Fallback color if nothing found
if (empty($color_hex)) {
    $color_hex = '#e4f1ce';
}
?>

<style>
    :root {
        --bg-color: <?php echo esc_attr($color_hex); ?>;
    }
    body {
        background-color: var(--bg-color);
       
    }
</style>

  
    <style>
        :root {
            --primary-color: #2563eb;
            --primary-hover: #1d4ed8;
            --secondary-color: #1e40af;
            --accent-color: #3b82f6;
            --light-color: #f8fafc;
            --dark-color: #1e293b;
            --text-secondary: #64748b;
            --border-color: #e2e8f0;
            --feature-bg: #f1f5f9;
            --shadow-light: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
            --shadow-medium: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
            --shadow-large: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
        }
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        /* Modal Styles */
        .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(0, 0, 0, 0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
        }
        
        .modal-container {
            background-color: white;
            border-radius: 12px;
            width: 90%;
            max-width: 500px;
            padding: 2.5rem;
            box-shadow: var(--shadow-large);
            text-align: center;
            animation: modalFadeIn 0.4s ease-out;
        }
        
        .modal-logo {
            margin-bottom: 1.5rem;
         place-self: center;
        }
        
        .modal-logo img {
            max-width: 180px;
            height: auto;
        }
        
        .modal-title {
            font-size: 1.5rem;
            color: var(--dark-color);
            margin-bottom: 1rem;
            font-weight: 700;
        }
        
        .modal-description {
            color: var(--text-secondary);
            margin-bottom: 2rem;
            font-size: 1rem;
            line-height: 1.6;
        }
        
        .email-input {
            width: 100%;
            padding: 1rem;
            border: 1px solid var(--border-color);
            border-radius: 8px;
            font-size: 1rem;
            margin-bottom: 1.5rem;
            transition: border-color 0.3s ease;
        }
        
        .email-input:focus {
            outline: none;
            border-color: var(--primary-color);
            box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
        }
        
        .confirm-btn {
            background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
            color: white;
            border: none;
            padding: 1rem 2rem;
            border-radius: 8px;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            width: 100%;
            transition: all 0.3s ease;
        }
        
        .confirm-btn:hover {
            background: linear-gradient(135deg, var(--primary-hover), var(--primary-color));
            transform: translateY(-2px);
            box-shadow: var(--shadow-medium);
        }
        
        @keyframes modalFadeIn {
            from {
                opacity: 0;
                transform: translateY(-20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        /* Hide main content initially */
        main {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background: var(--bg-color);
            color: var(--dark-color);
            line-height: 1.7;
            min-height: 100vh;
        }
        
        .container {
            max-width: 1200px;
            width: 100%;
            margin: 0 auto;
            padding: 3rem 1.5rem;
        }
        
        .logo {
            text-align: center;
            margin-bottom: 2rem;
            animation: fadeInDown 0.8s ease-out;
        }
        
        .logo img {
            max-width: 220px;
            height: auto;
            filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1));
            transition: transform 0.3s ease;
        }
        
        .logo img:hover {
            transform: scale(1.05);
        }
        
        .headline {
            text-align: center;
            margin-bottom: 3rem;
            animation: fadeInUp 0.8s ease-out 0.2s both;
        }
        
        .headline h1 {
            font-size: clamp(2rem, 4vw, 3rem);
            color: #0a2784;
            font-weight: 700;
            margin-bottom: 1rem;
            letter-spacing: -0.025em;
            position: relative;
        }
        
        .headline h1::after {
            content: '';
            position: absolute;
            bottom: -10px;
            left: 50%;
            transform: translateX(-50%);
            width: 80px;
            height: 4px;
            background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
            border-radius: 2px;
        }
        
        .headline p {
            font-size: 1.25rem;
            color: var(--text-secondary);
            max-width: 600px;
            margin: 0 auto;
            font-weight: 400;
        }
        
        .bonus-section {
            display: flex;
            flex-direction: column;
            gap: 2.5rem;
            margin-top: 2rem;
        }
        
        .bonus {
            background: white;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: var(--shadow-light);
            display: flex;
            flex-direction: column;
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            border: 1px solid var(--border-color);
            position: relative;
            animation: fadeInUp 0.6s ease-out both;
        }
        
        .bonus:nth-child(1) { animation-delay: 0.3s; }
        .bonus:nth-child(2) { animation-delay: 0.4s; }
        .bonus:nth-child(3) { animation-delay: 0.5s; }
        
        .bonus:hover {
            transform: translateY(-8px);
            box-shadow: var(--shadow-large);
            border-color: var(--accent-color);
        }
        
        .bonus::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 4px;
            background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
            opacity: 0;
            transition: opacity 0.3s ease;
        }
        
        .bonus:hover::before {
            opacity: 1;
        }
        
        .bonus-content {
            display: flex;
            flex-direction: column;
        }
        
        .bonus-image-container {
            padding: 1.5rem;
            background: linear-gradient(135deg, #fafbfc, #f1f5f9);
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
        }
        
        .bonus-image {
            width: 100%;
            height: 100%;
            max-height: 370px;
            object-fit: contain;
            transition: transform 0.3s ease;
            filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
            border-radius: 8px;
        }
        .bonus-image .img {
            max-height: 370px;
        }
        
        .bonus:hover .bonus-image {
            transform: scale(1.05);
        }
        
        .bonus-details {
            padding: 2.5rem;
            flex: 1;
        }
        
        .bonus-title {
            font-size: 28px !important;
            font-weight: 700;
            background: linear-gradient(135deg, #667eea, #764ba2);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            margin: 0 0 20px 0;
            letter-spacing: -0.5px;
        }
        
        .bonus-description {
            color: var(--text-secondary);
            margin-bottom: 1.5rem;
            font-size: 1.1rem;
            line-height: 1.6;
        }
        
        .bonus-features {
            background: linear-gradient(135deg, #f3e0f6 0%, #fce7ea 50%, #eaf2fb 100%);
            border: 2px solid var(--border-color);
            border-radius: 12px;
            padding: 1.5rem;
            margin-bottom: 2rem;
            position: relative;
            overflow: hidden;
        }
        
        .bonus-features h3 {
            color: var(--dark-color);
            margin-bottom: 1rem;
            font-size: 1.2rem;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        
        .bonus-features h3::before {
            content: '✨';
            font-size: 1.1rem;
        }
        
        .bonus-features ul {
            list-style-type: none;
            display: grid;
            gap: 0.75rem;
        }
        
        .bonus-features li {
            padding-left: 2rem;
            position: relative;
            color: #292929;
            font-size: 0.95rem;
            transition: color 0.2s ease;
        }
        
        .bonus-features li::before {
            content: "✓";
            color: #10b981;
            position: absolute;
            left: 0;
            font-weight: 700;
            font-size: 1.1rem;
            top: -1px;
        }
        
        .bonus-features li:hover {
            color: var(--dark-color);
        }
        
        .access-btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
            background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
            color: white;
            padding: 1rem 2.5rem;
            border-radius: 50px;
            text-decoration: none;
            font-weight: 600;
            font-size: 1.1rem;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            text-align: center;
            border: none;
            cursor: pointer;
            box-shadow: var(--shadow-medium);
            position: relative;
            overflow: hidden;
        }
        
        .access-btn::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
            transition: left 0.5s ease;
        }
        
        .access-btn:hover::before {
            left: 100%;
        }
        
        .access-btn:hover {
            transform: translateY(-2px);
            box-shadow: var(--shadow-large);
            background: linear-gradient(135deg, var(--primary-hover), var(--primary-color));
        }
        
        .access-btn:active {
            transform: translateY(0);
        }
        
        .access-btn::after {
            content: '→';
            transition: transform 0.3s ease;
            margin-left: 0.5rem;
        }
        
        .access-btn:hover::after {
            transform: translateX(4px);
        }
        
        /* Animations */
        @keyframes fadeInDown {
            from {
                opacity: 0;
                transform: translateY(-30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        /* Responsive Design */
        @media (min-width: 768px) {
            .bonus {
                flex-direction: row;
                align-items: stretch;
            }
            
            .bonus-image-container {
                flex: 0 0 35%;
                padding: 2rem;
                display: flex;
                align-items: center;
            max-height : 270px;
                justify-content: center;
            }
            
            .bonus-details {
                flex: 1;
                padding: 2.5rem;
                display: flex;
                flex-direction: column;
            }
            
            .bonus-features ul {
                grid-template-columns: 1fr 1fr;
            }
        }
        
        @media (min-width: 1024px) {
            .container {
                padding: 4rem 2rem;
            }
            
            .bonus-image-container {
                flex: 0 0 40%;
                padding: 2.5rem;
            }
            
            .bonus-details {
                padding: 3rem;
            }
        }
        
        @media (max-width: 767px) {
            .container {
                padding: 2rem 1rem;
            }
            
            .bonus-title {
                font-size: 1.5rem;
            }
            
            .bonus-details {
                padding: 2rem;
            }
            
            .bonus-image-container {
                padding: 1.5rem;
            }
            
            .modal-container {
                padding: 1.5rem;
            }
            
            .modal-title {
                font-size: 1.3rem;
            }
        }
        
        /* Accessibility improvements */
        @media (prefers-reduced-motion: reduce) {
            * {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
            }
        }
        
        .access-btn:focus {
            outline: 2px solid var(--primary-color);
            outline-offset: 2px;
        }
    </style>
</head>
<body>
<?php
global $wpdb;

// Step 1: Extract the slug from URL
$slug = basename(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH));

// Step 2: Use exact table name and correct column: page_slug
$table = 'wpqk_Offer_Page_Data';

$offer = $wpdb->get_row($wpdb->prepare(
    "SELECT * FROM $table WHERE LOWER(page_slug) = %s",
    strtolower($slug)
));

// Step 3: Fallbacks
$product_id = $offer ? intval($offer->id) : 0;
$user_id    = $offer ? intval($offer->user_id) : 3;
$logo_url = $offer && !empty($offer->logo_url) ? esc_url($offer->logo_url) : 'https://via.placeholder.com/300x80?text=Default+Logo';

?>

<?php
global $wpdb;

// Assuming $user_id is already defined above
$user_id = intval($user_id); // make sure it's an integer

// Define the correct table name (use your actual prefix if different)
$bonus_table = 'wpqk_jvz_bonus';

global $wpdb;

// Assuming $offer->bonuses contains a comma-separated list of bonus IDs
$bonus_ids_raw = $offer->bonuses;
$bonus_ids_array = array_filter(array_map('intval', explode(',', $bonus_ids_raw)));

if (!empty($bonus_ids_array)) {
    // Prepare placeholders for SQL IN clause
    $placeholders = implode(',', array_fill(0, count($bonus_ids_array), '%d'));

    // Build the SQL query dynamically
    $sql = $wpdb->prepare(
        "SELECT * FROM $bonus_table WHERE user_id = %d AND id IN ($placeholders)",
        array_merge([$user_id], $bonus_ids_array)
    );

    // Fetch bonuses
    $bonuses = $wpdb->get_results($sql);
} else {
    $bonuses = []; // No valid bonus IDs, return empty
}


?>

  <!-- Modal Overlay -->
<div class="modal-overlay" id="emailModal">
    <div class="modal-container">
       <?php
$is_image = (bool) preg_match('/\.(jpg|jpeg|png|gif|svg)$/i', $logo_url);
?>
<div class="modal-logo">
    <?php if ($is_image): ?>
     <div style="display: flex; justify-content: center;">
    <img src="<?php echo esc_url($logo_url); ?>" alt="Company Logo">
</div>

    <?php elseif (!empty($logo_url)): ?>
        <?php
$clean_logo_text = preg_replace('#^https?://#', '', $logo_url);
$clean_logo_text = urldecode($clean_logo_text);
?>
<h2 style="font-size: 28px; margin: 0;"><?php echo htmlspecialchars($clean_logo_text, ENT_QUOTES, 'UTF-8'); ?></h2>

    <?php endif; ?>
</div>

        <h2 class="modal-title">Confirm Your Purchase</h2>
        <p class="modal-description">Enter your purchase email address to claim your bonus</p>

        <form method="POST" action="<?php echo esc_url(admin_url('admin-post.php')); ?>">
            <input type="hidden" name="action" value="claim_bonus_form">
            <input type="email" class="email-input" name="email" id="purchaseEmail" placeholder="Your email address" required>
            <input type="hidden" name="product_id" value="<?php echo esc_attr($product_id); ?>">
            <input type="hidden" name="user_id" value="<?php echo esc_attr($user_id); ?>">

            <button class="confirm-btn" type="submit">Confirm Email</button>
        </form>
    </div>
</div>
<script>
    window.addEventListener('DOMContentLoaded', function () {
        const params = new URLSearchParams(window.location.search);
        const status = params.get('status');

        if (status === 'success' || status === 'already_claimed') {
            const modal = document.getElementById('emailModal');
            if (modal) modal.style.display = 'none';
        }
    });
</script>


<main id="mainContent">
    <div class="container">
        <div class="modal-logo">
    <?php if ($is_image): ?>
        <img src="<?php echo esc_url($logo_url); ?>" alt="Company Logo">
    <?php elseif (!empty($logo_url)): ?>
       <?php
$clean_logo_text = preg_replace('#^https?://#', '', $logo_url);
$clean_logo_text = urldecode($clean_logo_text);
?>
<h2 style="font-size: 38px; margin: 0;"><?php echo htmlspecialchars($clean_logo_text, ENT_QUOTES, 'UTF-8'); ?></h2>

    <?php endif; ?>
</div>
        <div class="headline">
            <h1>Access Your Bonuses Below</h1>
        </div>

        <div class="bonus-section">
            <?php if (!empty($bonuses)) : ?>
                <?php foreach ($bonuses as $bonus) : ?>
                    <div class="bonus">
                        <div class="bonus-image-container">
                            <img src="<?php echo esc_url($bonus->bonus_image); ?>" alt="<?php echo esc_attr($bonus->name); ?>" class="bonus-image">
                        </div>
                        <div class="bonus-details">
                            <h2 class="bonus-title"><?php echo esc_html($bonus->name); ?></h2>
                            <p class="bonus-description"><?php echo esc_html($bonus->description); ?></p>

                            <a href="<?php echo esc_url($bonus->access_url); ?>" target="_blank">
                                <button class="access-btn">Access This Bonus</button>
                            </a>
                        </div>
                    </div>
                <?php endforeach; ?>
            <?php else : ?>
                <p>No bonuses found for this user.</p>
            <?php endif; ?>
        </div>
    </div>
</main>

    <!-- Main Content (hidden initially) -->
    <!--<main id="mainContent">-->
    <!--    <div class="container">-->
    <!--        <div class="logo">-->
    <!--            <img src="https://hosting.photobucket.com/9ade4d44-17f6-4a2a-94fd-326ab824118b/15e114cc-be05-4753-888d-e5726e582ada.png" alt="Company Logo">-->
    <!--        </div>-->
            
    <!--        <div class="headline">-->
    <!--            <h1>Access Your Bonuses Below</h1>-->
    <!--        </div>-->
            
    <!--        <div class="bonus-section">-->
                <!-- Bonus 1 -->
    <!--            <div class="bonus">-->
    <!--                <div class="bonus-image-container">-->
    <!--                    <img src="https://hosting.photobucket.com/9ade4d44-17f6-4a2a-94fd-326ab824118b/47dba909-4bd8-475e-b0fe-98738d4462e2.png" alt="Bonus 1" class="bonus-image">-->
    <!--                </div>-->
    <!--                <div class="bonus-details">-->
    <!--                    <h2 class="bonus-title">Forex and Trading Expert</h2>-->
    <!--                    <p class="bonus-description">Get access to our exclusive video tutorial series that will guide you through advanced techniques and hidden features.</p>-->
                        
    <!--                    <div class="bonus-features">-->
    <!--                        <h3>What's Included:</h3>-->
    <!--                        <ul>-->
    <!--                            <li>10+ hours of HD video content</li>-->
    <!--                            <li>Step-by-step walkthroughs</li>-->
    <!--                            <li>Downloadable project files</li>-->
    <!--                            <li>Expert tips and tricks</li>-->
    <!--                            <li>Lifetime access with updates</li>-->
    <!--                        </ul>-->
    <!--                    </div>-->
                        
    <!--                    <button class="access-btn">Access This Bonus</button>-->
    <!--                </div>-->
    <!--            </div>-->
                
                <!-- Bonus 2 -->
    <!--            <div class="bonus">-->
    <!--                <div class="bonus-image-container">-->
    <!--                    <img src="https://hosting.photobucket.com/9ade4d44-17f6-4a2a-94fd-326ab824118b/7f9cdb0b-05c4-4c79-9857-93a6f235908c.png" alt="Bonus 2" class="bonus-image">-->
    <!--                </div>-->
    <!--                <div class="bonus-details">-->
    <!--                    <h2 class="bonus-title">Efficient Home Work</h2>-->
    <!--                    <p class="bonus-description">Jumpstart your projects with our professionally designed templates that save you hours of work.</p>-->
                        
    <!--                    <div class="bonus-features">-->
    <!--                        <h3>What's Included:</h3>-->
    <!--                        <ul>-->
    <!--                            <li>50+ customizable templates</li>-->
    <!--                            <li>Multiple format options</li>-->
    <!--                            <li>Commercial usage rights</li>-->
    <!--                            <li>Regular new additions</li>-->
    <!--                            <li>Detailed documentation</li>-->
    <!--                        </ul>-->
    <!--                    </div>-->
                        
    <!--                    <button class="access-btn">Access This Bonus</button>-->
    <!--                </div>-->
    <!--            </div>-->
                
                <!-- Bonus 3 -->
    <!--            <div class="bonus">-->
    <!--                <div class="bonus-image-container">-->
    <!--                    <img src="https://hosting.photobucket.com/9ade4d44-17f6-4a2a-94fd-326ab824118b/e0494d33-aafe-4279-befb-ecb01a0dcd2c.png" alt="Bonus 3" class="bonus-image">-->
    <!--                </div>-->
    <!--                <div class="bonus-details">-->
    <!--                    <h2 class="bonus-title">The Side Hustlers Blueprint</h2>-->
    <!--                    <p class="bonus-description">Join our exclusive community of like-minded individuals and get direct access to experts.</p>-->
                        
    <!--                    <div class="bonus-features">-->
    <!--                        <h3>What's Included:</h3>-->
    <!--                        <ul>-->
    <!--                            <li>24/7 community support</li>-->
    <!--                            <li>Weekly live Q&A sessions</li>-->
    <!--                            <li>Exclusive challenges</li>-->
    <!--                            <li>Networking opportunities</li>-->
    <!--                            <li>Resource sharing hub</li>-->
    <!--                        </ul>-->
    <!--                    </div>-->
                        
    <!--                    <button class="access-btn">Access This Bonus</button>-->
    <!--                </div>-->
    <!--            </div>-->
    <!--        </div>-->
    <!--    </div>-->
    <!--</main>-->
    
    <script>
document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('emailForm');
    const emailInput = document.getElementById('purchaseEmail');
    const modal = document.getElementById('emailModal');

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const email = emailInput.value.trim();
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            alert('Please enter a valid email address.');
            return;
        }

        const formData = new FormData(form);

        fetch('<?php echo esc_url(admin_url("admin-ajax.php")); ?>', {
            method: 'POST',
            body: formData
        })
        .then(res => res.json())
        .then(response => {
            if (response.success) {
                modal.style.display = 'none';
                localStorage.setItem('bonusClaimed', '1');
                const content = document.getElementById('mainContent');
                if (content) content.style.display = 'block';
            } else {
                alert(response.data || 'Something went wrong.');
            }
        })
        .catch(err => {
            console.error(err);
            alert('Submission failed.');
        });
    });

    if (localStorage.getItem('bonusClaimed') === '1') {
        modal.style.display = 'none';
        const content = document.getElementById('mainContent');
        if (content) content.style.display = 'block';
    }
});
</script>


</body>
</html>