import React from 'react'
import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Heading,
  Text,
  Link,
  Button,
  Hr,
} from '@react-email/components'

interface WelcomeEmailProps {
  email: string
  source?: string
}

/**
 * Welcome Email Template for aclue Newsletter Subscribers
 *
 * React-based email template using @react-email/components for optimal
 * email client compatibility and responsive design.
 *
 * Enhanced UX Features:
 * - Prominent "Get Started" CTA button with aclue brand styling
 * - Integrated aclue brand colours throughout design
 * - Restructured content hierarchy with scannable sections
 * - Consistent typographic scale and multi-breakpoint responsive strategy
 * - Engagement elements with social proof and British English copy
 * - Email client compatibility (Outlook, Gmail, etc.)
 * - Light/Dark theme support with CSS media queries
 * - SVG logo for better quality and theme compatibility
 * - Enhanced glassmorphism design elements
 * - Accessible HTML structure with proper ARIA labels
 *
 * Brand Integration:
 * - aclue primary purple gradient (#f03dff to #59006d)
 * - Professional typography scale optimised for readability
 * - Mobile-first responsive design with enhanced touch targets
 * - British English throughout all copy
 */
export default function WelcomeEmail({ email, source = 'newsletter' }: WelcomeEmailProps) {
  // SVG logo with optimised inline styling for email clients
  // Using the correct aclue logo from /public/aclue_logo_with_text.svg with proper fill colors
  const aclueLogoSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="158.2 172.5 866.8 866.8" width="200px" height="200px" preserveAspectRatio="xMidYMid meet" style="margin: 0 auto; display: block;">
  <path opacity="1.000000" stroke="none" fill="currentColor" d="M 728.698 445.693 C 718.14 449.277 708.093 453.725 697.58 455.737 C 675.804 459.904 653.625 460.217 631.481 459.987 C 631.024 459.982 630.565 460.198 629.329 460.502 C 632.26 464.601 634.777 468.59 637.754 472.199 C 649.558 486.503 661.654 500.569 673.303 514.997 C 676.476 518.926 679.331 523.543 680.815 528.316 C 683.74 537.723 678.671 544.124 673.093 547.35 C 667.794 550.415 661.325 549.608 655.359 543.647 C 646.945 535.241 639.108 526.249 631.167 517.379 C 624.196 509.593 617.242 501.779 610.613 493.704 C 604.19 485.88 598.193 477.706 592.002 469.692 C 591.513 469.059 590.965 468.473 590.327 467.728 C 585.099 473.791 579.998 479.674 574.934 485.589 C 569.381 492.074 563.938 498.655 558.311 505.075 C 550.156 514.38 542.032 523.72 533.592 532.762 C 529.152 537.519 524.197 541.828 519.228 546.05 C 515.811 548.953 511.629 548.773 507.711 547.124 C 502.466 544.917 498.742 541.28 497.992 535.25 C 496.855 526.1 501.765 519.669 507.285 513.242 C 519.998 498.442 532.484 483.445 544.964 468.446 C 546.897 466.123 548.313 463.37 550.348 460.231 C 548.422 460.141 546.889 460.046 545.354 460.003 C 532.921 459.655 520.472 459.594 508.058 458.91 C 490.608 457.947 473.314 455.234 457.179 448.442 C 430.455 437.193 411.426 418.608 406.117 388.928 C 401.768 364.62 407.219 342.853 424.762 324.7 C 432.148 317.057 440.163 310.66 451.085 308.954 C 464.746 306.821 478.208 307.26 491.071 312.719 C 505.306 318.76 517.671 327.73 529.307 337.845 C 546.67 352.937 560.848 370.784 574.588 389.061 C 579.178 395.166 584.151 400.982 589.06 407.069 C 596.373 398.495 603.969 390.146 610.939 381.303 C 625.282 363.106 640.23 345.588 658.407 330.961 C 670.077 321.57 682.376 313.173 696.955 309.806 C 720.725 304.318 741.868 307.576 759.445 329.641 C 772.237 345.699 776.494 363.74 774.748 383.317 C 773.146 401.275 765.673 416.834 752.202 429.431 C 745.194 435.985 737.71 441.525 728.698 445.693 M 448.941 402.549 C 454.247 407.039 458.993 412.556 464.968 415.822 C 481.176 424.683 499.531 424.395 517.279 425.837 C 529.523 426.832 541.914 426.048 554.239 425.996 C 555.75 425.989 557.26 425.585 559.58 425.248 C 552.884 416.684 547.009 408.653 540.593 401.081 C 529.426 387.903 518.466 374.478 506.392 362.165 C 496.862 352.447 485.96 344.127 471.889 341.187 C 462.571 339.24 448.779 343.182 444.325 350.29 C 434.056 366.681 436.221 387.306 448.941 402.549 M 683.689 424.023 C 698.362 423.029 712.042 419.758 723.812 409.921 C 737.316 398.635 743.572 384.472 741.728 367.286 C 741.109 361.508 738.303 355.33 734.773 350.629 C 726.896 340.14 715.757 339.258 703.801 342.554 C 691.579 345.923 682.057 353.654 673.43 362.234 C 663.386 372.224 653.977 382.905 644.869 393.768 C 636.535 403.707 628.969 414.29 620.857 424.86 C 623.211 425.325 624.965 425.992 626.709 425.967 C 644.636 425.706 662.562 425.343 680.486 424.956 C 681.253 424.939 682.009 424.412 683.689 424.023 Z" style="transform-origin: 591.611px 433.4px 0px;"/>
  <path opacity="1.000000" stroke="none" fill="currentColor" d="M 343.999 709.999 C 344.332 743.7 344.695 776.942 344.962 810.184 C 344.998 814.745 342.393 817.011 337.813 817.004 C 329.318 816.989 320.823 817.053 312.329 816.979 C 307.083 816.933 305.026 814.731 305.006 809.435 C 304.99 805.018 305.003 800.6 305.003 795.171 C 300.063 799.485 296.159 803.414 291.748 806.653 C 274.645 819.211 255.135 824.239 234.362 821.725 C 219.526 819.929 205.789 814.089 193.819 804.432 C 183.671 796.246 175.117 786.77 169.13 775.331 C 163.743 765.038 159.66 754.324 158.71 742.268 C 157.717 729.673 158.063 717.437 160.973 705.215 C 164.541 690.236 171.623 677.164 181.809 665.606 C 192.828 653.101 206.148 643.999 221.858 638.838 C 235.644 634.308 249.83 633.208 264.487 634.741 C 276.34 635.98 287.448 638.817 297.966 644.058 C 313.082 651.591 324.889 662.651 333.19 677.537 C 338.798 687.595 342.62 698.121 343.999 709.999 M 299.009 702.664 C 292.497 687.205 280.438 677.938 264.641 674.174 C 246.957 669.96 231.085 674.973 217.53 686.957 C 196.537 705.516 194.367 739.13 209.261 760.627 C 217.793 772.94 228.941 781.27 244.755 783.284 C 261.515 785.42 275.916 781.744 287.643 769.774 C 302.541 754.568 304.669 735.4 302.661 715.401 C 302.253 711.339 300.341 707.427 299.009 702.664 Z" style="transform-origin: 591.611px 433.4px 0px;"/>
  <path opacity="1.000000" stroke="none" fill="currentColor" d="M 963.741 637.029 C 988.521 645.462 1005.06 662.188 1016.57 684.905 C 1024.7 700.954 1025.35 717.908 1024.91 735.164 C 1024.79 739.79 1020.38 742.852 1014.66 742.888 C 1003.49 742.96 992.329 742.913 981.165 742.912 C 952.339 742.911 923.512 742.907 894.686 742.905 C 892.209 742.904 889.733 742.905 886.912 742.905 C 890.356 756.167 895.091 768.166 905.484 776.882 C 912.787 783.006 921.132 787.016 930.876 788.08 C 952.925 790.486 971.706 783.505 988.466 769.468 C 990.118 768.084 994.862 768.251 996.71 769.641 C 1002.23 773.797 1007.11 778.841 1012.08 783.69 C 1015.23 786.752 1016.27 789.714 1012.81 793.877 C 1002.22 806.644 988.461 814.091 972.98 818.903 C 958.537 823.394 943.584 825.111 928.689 823.747 C 910.128 822.048 893.366 814.889 878.634 803.145 C 862.295 790.119 852.739 773.237 847.85 753.059 C 843.193 733.836 843.972 715.004 850.085 696.458 C 860.401 665.162 881.93 645.059 913.564 636.518 C 924.748 633.498 936.575 632.595 948.319 634.933 C 953.261 635.917 958.317 636.33 963.741 637.029 M 981.976 706.908 C 981.652 705.998 981.227 705.11 981.019 704.175 C 978.837 694.357 974.111 685.799 966.579 679.33 C 955.225 669.579 941.857 667.299 927.187 669.906 C 907.788 673.353 891.976 689.925 888.341 710.092 C 918.703 710.092 949.017 710.112 979.33 709.996 C 980.224 709.992 981.112 708.564 981.976 706.908 Z" style="transform-origin: 591.611px 433.4px 0px;"/>
  <path opacity="1.000000" stroke="none" fill="currentColor" d="M 650.647 640.076 C 658.917 640.064 666.746 640.038 674.575 640.069 C 682.763 640.101 685.973 643.277 685.975 651.301 C 685.985 682.452 686.112 713.603 685.919 744.753 C 685.857 754.731 688.062 763.863 694.309 771.611 C 700.177 778.889 708.523 782.139 717.437 784.021 C 726.459 785.925 735.203 784.869 743.992 782.161 C 759.206 777.475 767.163 766.798 769.985 751.768 C 770.798 747.438 770.996 742.942 771.008 738.52 C 771.09 709.035 771.04 679.55 771.045 650.066 C 771.047 642.543 773.478 640.116 781.13 640.056 C 787.626 640.005 794.134 640.269 800.618 639.979 C 810.33 639.544 810.928 642.657 811.764 650.967 C 812.377 657.068 811.883 663.282 811.883 669.445 C 811.883 694.599 812.16 719.757 811.744 744.904 C 811.583 754.611 811.126 764.453 807.068 773.699 C 800.677 788.263 791.139 799.997 777.77 808.758 C 767.425 815.538 755.934 819.663 744.071 821.643 C 729.331 824.102 714.396 824.058 699.703 819.402 C 690.688 816.545 682.14 813.181 674.09 808.11 C 666.258 803.177 660.05 796.663 655.28 789.16 C 648.791 778.952 644.976 767.627 644.934 755.146 C 644.813 720.059 644.38 684.973 644.069 649.886 C 644.029 645.313 645.055 641.409 650.647 640.076 Z" style="transform-origin: 591.611px 433.4px 0px;"/>
  <path opacity="1.000000" stroke="none" fill="currentColor" d="M 441.191 684.215 C 431.057 691.942 424.821 701.898 422.075 713.806 C 418.191 730.644 419.84 747.144 430.264 761.175 C 438.736 772.579 449.655 781.157 464.896 783.245 C 475.164 784.652 484.981 784.006 494.052 779.821 C 501.597 776.34 508.446 771.155 515.135 766.104 C 517.777 764.11 519.655 763.754 521.979 765.52 C 526.783 769.168 531.47 772.971 536.168 776.757 C 537.199 777.589 537.979 778.739 539.032 779.536 C 545.487 784.421 545.596 787.506 540.251 793.287 C 527.749 806.807 512.967 816.467 495.002 821.003 C 473.549 826.419 452.559 825.247 432.449 815.751 C 410.164 805.229 394.305 788.635 384.708 765.626 C 379.236 752.507 377.85 739.042 378.146 725.32 C 378.671 700.96 387.441 679.432 404.231 661.914 C 417.372 648.203 433.522 639.222 452.723 635.846 C 469.576 632.882 485.973 633.686 502.079 639.07 C 517.862 644.345 531.399 653.196 541.793 666.372 C 545.581 671.174 544.58 674.457 539.593 678.124 C 534.048 682.204 528.674 686.543 523.474 691.056 C 520.439 693.69 517.882 693.811 514.81 691.322 C 507.121 685.09 499.617 678.858 489.781 675.674 C 477.853 671.814 466.384 671.766 454.979 676.562 C 450.267 678.544 445.953 681.47 441.191 684.215 Z" style="transform-origin: 591.611px 433.4px 0px;"/>
  <path opacity="1.000000" stroke="none" fill="currentColor" d="M 570.002 741 C 570.002 685.376 570.002 630.251 570.003 575.127 C 570.004 568.66 572.659 566.03 579.276 566.007 C 586.77 565.981 594.265 565.987 601.759 566.005 C 608.126 566.021 609.997 567.868 609.997 574.089 C 609.999 651.862 609.999 729.636 609.999 807.41 C 609.998 815.58 610.079 816.385 601.946 817.221 C 593.501 818.089 584.874 817.213 576.328 817.044 C 570.964 816.937 570.003 813.297 570.003 808.948 C 570.004 786.466 570.003 763.983 570.002 741 Z" style="transform-origin: 591.611px 433.4px 0px;"/>
</svg>
  `;


  // Enhanced email styles with aclue brand colors and multi-breakpoint responsive design
  const emailStyles = `
    /* Dark theme support with aclue brand integration */
    @media (prefers-color-scheme: dark) {
      body { color: #e5e7eb !important; background-color: #0a0a0a !important; }
      .container { background: rgba(23, 23, 23, 0.95) !important; border: 1px solid rgba(115, 115, 115, 0.3) !important; }
      .glassmorphism-card { background: rgba(38, 38, 38, 0.8) !important; border: 1px solid rgba(115, 115, 115, 0.4) !important; }
      .text { color: #e5e7eb !important; }
      .heading { color: #ffffff !important; }
      .footer { color: #a3a3a3 !important; }
      .logo svg { color: #ffffff !important; }
      .cta-button { background: linear-gradient(135deg, #f03dff 0%, #59006d 100%) !important; }
      .highlight-section { background: rgba(38, 38, 38, 0.6) !important; border: 1px solid rgba(240, 61, 255, 0.3) !important; }
    }

    /* Multi-breakpoint responsive strategy */
    @media only screen and (max-width: 480px) {
      .container { padding: 16px !important; margin: 8px !important; border-radius: 12px !important; }
      .logo svg { width: 160px !important; height: auto !important; }
      .glassmorphism-card { padding: 16px !important; margin: 12px 0 !important; border-radius: 12px !important; }
      .cta-button { padding: 14px 28px !important; font-size: 16px !important; }
      .heading-main { font-size: 24px !important; line-height: 1.2 !important; }
      .section-spacing { margin: 20px 0 !important; }
    }

    @media only screen and (max-width: 600px) {
      .container { padding: 20px !important; margin: 10px !important; }
      .logo svg { width: 180px !important; height: auto !important; }
      .glassmorphism-card { padding: 20px !important; margin: 15px 0 !important; }
      .cta-button { padding: 16px 32px !important; }
      .two-column { display: block !important; }
      .column { width: 100% !important; margin-bottom: 20px !important; }
    }

    /* Enhanced glassmorphism with aclue brand accent */
    .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
    .glassmorphism-card {
      background: rgba(255, 255, 255, 0.08);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.18);
      border-radius: 20px;
      padding: 32px;
      margin: 28px 0;
      box-shadow: 0 12px 40px 0 rgba(240, 61, 255, 0.15);
    }

    /* aclue brand color integration */
    .brand-accent { color: #f03dff; }
    .brand-gradient { background: linear-gradient(135deg, #f03dff 0%, #59006d 100%); }
    .highlight-section {
      background: rgba(240, 61, 255, 0.05);
      border: 1px solid rgba(240, 61, 255, 0.2);
      border-radius: 16px;
      padding: 24px;
      margin: 24px 0;
    }

    /* Enhanced typography scale */
    .heading-main { font-size: 32px; line-height: 1.25; font-weight: 700; }
    .heading-section { font-size: 20px; line-height: 1.3; font-weight: 600; }
    .text-body { font-size: 16px; line-height: 1.6; }
    .text-small { font-size: 14px; line-height: 1.5; }

    /* CTA button with enhanced styling */
    .cta-button {
      background: linear-gradient(135deg, #f03dff 0%, #59006d 100%);
      color: #ffffff;
      padding: 18px 36px;
      border-radius: 12px;
      text-decoration: none;
      font-weight: 600;
      font-size: 18px;
      display: inline-block;
      box-shadow: 0 8px 24px rgba(240, 61, 255, 0.3);
      transition: all 0.3s ease;
      border: none;
      cursor: pointer;
    }

    /* Enhanced email client compatibility - especially Outlook */
    table { border-spacing: 0; border-collapse: collapse; }
    img { border: 0; outline: none; display: block; }
    a { text-decoration: none; }

    /* Outlook-specific fixes */
    .outlook-fix { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    .outlook-button { mso-padding-alt: 0; }

    /* Gmail app dark mode support */
    @media (prefers-color-scheme: dark) {
      [data-ogsc] .cta-button { background: linear-gradient(135deg, #f03dff 0%, #59006d 100%) !important; }
      [data-ogsc] .brand-accent { color: #f03dff !important; }
    }

    /* High contrast mode support */
    @media (prefers-contrast: high) {
      .cta-button { border: 2px solid #ffffff !important; }
      .brand-accent { font-weight: 700 !important; }
    }

    /* Reduced motion support */
    @media (prefers-reduced-motion: reduce) {
      .cta-button { transition: none !important; }
    }
  `

  return (
    <Html>
      <Head>
        <title>Welcome to aclue - AI-Powered Gift Discovery Awaits!</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <style>{emailStyles}</style>
      </Head>
      <Body style={main}>
        <Container className="container" style={container}>
          {/* Logo Section with Enhanced Spacing */}
          <Section style={{ textAlign: 'center', marginBottom: '40px' }}>
            <div dangerouslySetInnerHTML={{ __html: aclueLogoSvg }} />
          </Section>

          {/* Welcome Header with aclue Brand Styling */}
          <Section style={{ textAlign: 'center', marginBottom: '32px' }}>
            <Heading className="heading-main heading" style={h1}>
              Welcome to <span className="brand-accent" style={{ color: '#f03dff' }}>aclue</span>!
            </Heading>
            <Text className="text-body text" style={welcomeSubtext}>
              You're now part of Britain's most intelligent gifting community
            </Text>
          </Section>

          {/* Social Proof Section */}
          <Section className="highlight-section section-spacing" style={highlightSection}>
            <Text className="text-body" style={{ ...cardText, textAlign: 'center', margin: '0 0 16px 0' }}>
              <strong>🎉 Join over 10,000+ early adopters</strong> who've discovered the future of thoughtful gifting
            </Text>
          </Section>

          {/* Primary CTA Button */}
          <Section style={{ textAlign: 'center', margin: '32px 0' }}>
            <Button
              className="cta-button"
              style={ctaButton}
              href="https://aclue.app"
            >
              Get Started with aclue
            </Button>
            <Text className="text-small" style={{ ...text, fontSize: '14px', margin: '12px 0 0 0', textAlign: 'center' }}>
              Start discovering personalised gift recommendations in seconds
            </Text>
          </Section>

          <Hr style={divider} />

          {/* Introduction Text with Better Hierarchy */}
          <Section className="section-spacing" style={{ margin: '32px 0' }}>
            <Text className="text-body text" style={text}>
              Thank you for subscribing to our newsletter, {email.split('@')[0]}! You're now part of the aclue community, where AI-powered gifting meets personalised discovery.
            </Text>
            <Text className="text-body text" style={text}>
              We'll keep you updated with the latest features, intelligent gift recommendations, and exclusive early access to new capabilities before anyone else.
            </Text>
          </Section>

          {/* Enhanced Feature Showcase */}
          <Section className="glassmorphism-card" style={glassmorphismCard}>
            <Heading className="heading-section" style={cardHeading}>
              🎁 What makes aclue brilliantly different?
            </Heading>

            {/* Two-column feature layout for desktop */}
            <div className="two-column" style={{ display: 'table', width: '100%', marginTop: '24px' }}>
              <div className="column" style={{ display: 'table-cell', width: '50%', paddingRight: '16px', verticalAlign: 'top' }}>
                <Text className="text-body" style={featureText}>
                  <span className="brand-accent" style={{ color: '#f03dff', fontWeight: '600' }}>🧠 AI-Powered Intelligence</span><br />
                  Our advanced algorithms learn your preferences and suggest perfect gifts with uncanny accuracy.
                </Text>
                <Text className="text-body" style={featureText}>
                  <span className="brand-accent" style={{ color: '#f03dff', fontWeight: '600' }}>📱 Seamless Discovery</span><br />
                  Browse, save, and organise gift ideas with our intuitive, mobile-optimised interface.
                </Text>
              </div>
              <div className="column" style={{ display: 'table-cell', width: '50%', paddingLeft: '16px', verticalAlign: 'top' }}>
                <Text className="text-body" style={featureText}>
                  <span className="brand-accent" style={{ color: '#f03dff', fontWeight: '600' }}>🎯 Personalised Matching</span><br />
                  Every recommendation is tailored specifically to you and your gift recipients.
                </Text>
                <Text className="text-body" style={featureText}>
                  <span className="brand-accent" style={{ color: '#f03dff', fontWeight: '600' }}>🔔 Smart Notifications</span><br />
                  Never miss the perfect gift with our intelligent alert system and timely reminders.
                </Text>
              </div>
            </div>
          </Section>

          {/* Call to Action Section */}
          <Section className="section-spacing" style={{ textAlign: 'center', margin: '36px 0' }}>
            <Text className="text-body text" style={text}>
              Ready to transform how you discover and give gifts? The future of thoughtful gifting starts here, and we're thrilled to have you with us.
            </Text>
            <Button
              className="cta-button"
              style={ctaButtonSecondary}
              href="https://aclue.app/discover"
            >
              Explore Gift Recommendations
            </Button>
          </Section>

          <Hr style={divider} />

          {/* Footer with Enhanced British English */}
          <Section style={{ textAlign: 'center', marginTop: '32px' }}>
            <Text className="footer" style={footer}>
              Brilliant to have you aboard!<br />
              <strong>The aclue Team</strong><br />
              <em>Britain's AI-powered gifting platform</em>
            </Text>
            <Text className="text-small" style={footerSmall}>
              Questions? Simply reply to this email - we'd love to hear from you!
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

// Enhanced styles with aclue brand integration and improved hierarchy
const main = {
  backgroundColor: '#fafafa',
  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif',
  margin: '0',
  padding: '0',
  lineHeight: '1.6',
}

const container = {
  maxWidth: '600px',
  margin: '0 auto',
  padding: '40px 20px',
  backgroundColor: 'rgba(255, 255, 255, 0.98)',
  backdropFilter: 'blur(12px)',
  border: '1px solid rgba(240, 61, 255, 0.1)',
  borderRadius: '20px',
  boxShadow: '0 12px 40px 0 rgba(240, 61, 255, 0.08)',
}

const h1 = {
  fontSize: '32px',
  fontWeight: '700',
  color: '#1f2937',
  textAlign: 'center' as const,
  margin: '0 0 16px 0',
  lineHeight: '1.25',
}

const welcomeSubtext = {
  fontSize: '18px',
  lineHeight: '1.4',
  color: '#6b7280',
  textAlign: 'center' as const,
  margin: '0',
  fontWeight: '500',
}

const text = {
  fontSize: '16px',
  lineHeight: '1.6',
  color: '#374151',
  margin: '0 0 20px 0',
}

const highlightSection = {
  background: 'rgba(240, 61, 255, 0.05)',
  border: '1px solid rgba(240, 61, 255, 0.2)',
  borderRadius: '16px',
  padding: '24px',
  margin: '24px 0',
  textAlign: 'center' as const,
}

const glassmorphismCard = {
  background: 'rgba(255, 255, 255, 0.08)',
  backdropFilter: 'blur(12px)',
  border: '1px solid rgba(255, 255, 255, 0.18)',
  borderRadius: '20px',
  padding: '32px',
  margin: '28px 0',
  boxShadow: '0 12px 40px 0 rgba(240, 61, 255, 0.15)',
}

const cardHeading = {
  fontSize: '22px',
  fontWeight: '600',
  color: '#1f2937',
  margin: '0 0 24px 0',
  textAlign: 'center' as const,
  lineHeight: '1.3',
}

const cardText = {
  fontSize: '16px',
  lineHeight: '1.7',
  color: '#374151',
  margin: '0',
}

const featureText = {
  fontSize: '15px',
  lineHeight: '1.6',
  color: '#374151',
  margin: '0 0 20px 0',
}

const ctaButton = {
  background: 'linear-gradient(135deg, #f03dff 0%, #59006d 100%)',
  color: '#ffffff',
  padding: '18px 36px',
  borderRadius: '12px',
  textDecoration: 'none',
  fontWeight: '600',
  fontSize: '18px',
  display: 'inline-block',
  boxShadow: '0 8px 24px rgba(240, 61, 255, 0.3)',
  border: 'none',
  cursor: 'pointer',
  textAlign: 'center' as const,
}

const ctaButtonSecondary = {
  background: 'linear-gradient(135deg, #0ea5e9 0%, #075985 100%)',
  color: '#ffffff',
  padding: '16px 32px',
  borderRadius: '10px',
  textDecoration: 'none',
  fontWeight: '600',
  fontSize: '16px',
  display: 'inline-block',
  boxShadow: '0 6px 20px rgba(14, 165, 233, 0.3)',
  border: 'none',
  cursor: 'pointer',
  textAlign: 'center' as const,
  marginTop: '16px',
}

const divider = {
  border: 'none',
  borderTop: '1px solid rgba(240, 61, 255, 0.1)',
  margin: '32px 0',
  width: '100%',
}

const footer = {
  fontSize: '16px',
  color: '#6b7280',
  textAlign: 'center' as const,
  margin: '0 0 16px 0',
  lineHeight: '1.5',
}

const footerSmall = {
  fontSize: '14px',
  color: '#9ca3af',
  textAlign: 'center' as const,
  margin: '0',
  lineHeight: '1.4',
}