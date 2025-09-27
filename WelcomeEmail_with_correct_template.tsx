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
 * Features:
 * - Light/Dark theme support with CSS media queries
 * - SVG logo for better quality and theme compatibility
 * - Enhanced glassmorphism design elements
 * - Responsive design that works across all email clients
 * - aclue branding with updated logo and styling
 * - Feature highlights with icons and descriptions
 * - Accessible HTML structure
 * - Email client fallbacks and compatibility fixes
 *
 * Updated to match backend email service template with enhanced theming.
 */
export default function WelcomeEmail({ email, source = 'newsletter' }: WelcomeEmailProps) {
  // SVG logo with optimised inline styling for email clients
  const aclueLogoSvg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="158.2 172.5 866.8 866.8" style="width: 200px; height: 200px; max-width: 100%; display: block; margin: 0 auto; color: #333333;">
        <path opacity="1.000000" stroke="none" fill="currentColor" d="M 728.698 445.693 C 718.14 449.277 708.093 453.725 697.58 455.737 C 675.804 459.904 653.625 460.217 631.481 459.987 C 631.024 459.982 630.565 460.198 629.329 460.502 C 632.26 464.601 634.777 468.59 637.754 472.199 C 649.558 486.503 661.654 500.569 673.303 514.997 C 676.476 518.926 679.331 523.543 680.815 528.316 C 683.74 537.723 678.671 544.124 673.093 547.35 C 667.794 550.415 661.325 549.608 655.359 543.647 C 646.945 535.241 639.108 526.249 631.167 517.379 C 624.196 509.593 617.242 501.779 610.613 493.704 C 604.19 485.88 598.193 477.706 592.002 469.692 C 591.513 469.059 590.965 468.473 590.327 467.728 C 585.099 473.791 579.998 479.674 574.934 485.589 C 569.381 492.074 563.938 498.655 558.311 505.075 C 550.156 514.38 542.032 523.72 533.592 532.762 C 529.152 537.519 524.197 541.828 519.228 546.05 C 515.811 548.953 511.629 548.773 507.711 547.124 C 502.466 544.917 498.742 541.28 497.992 535.25 C 496.855 526.1 501.765 519.669 507.285 513.242 C 519.998 498.442 532.484 483.445 544.964 468.446 C 546.897 466.123 548.313 463.37 550.348 460.231 C 548.422 460.141 546.889 460.046 545.354 460.003 C 532.921 459.655 520.472 459.594 508.058 458.91 C 490.608 457.947 473.314 455.234 457.179 448.442 C 430.455 437.193 411.426 418.608 406.117 388.928 C 401.768 364.62 407.219 342.853 424.762 324.7 C 432.148 317.057 440.163 310.66 451.085 308.954 C 464.746 306.821 478.208 307.26 491.071 312.719 C 505.306 318.76 517.671 327.73 529.307 337.845 C 546.67 352.937 560.848 370.784 574.588 389.061 C 579.178 395.166 584.151 400.982 589.06 407.069 C 596.373 398.495 603.969 390.146 610.939 381.303 C 625.282 363.106 640.23 345.588 658.407 330.961 C 670.077 321.57 682.376 313.173 696.955 309.806 C 720.725 304.318 741.868 307.576 759.445 329.641 C 772.237 345.699 776.494 363.74 774.748 383.317 C 773.146 401.275 765.673 416.834 752.202 429.431 C 745.194 435.985 737.71 441.525 728.698 445.693 M 448.941 402.549 C 454.247 407.039 458.993 412.556 464.968 415.822 C 481.176 424.683 499.531 424.395 517.279 425.837 C 529.523 426.832 541.914 426.048 554.239 425.996 C 555.75 425.989 557.26 425.585 559.58 425.248 C 552.884 416.684 547.009 408.653 540.593 401.081 C 529.426 387.903 518.466 374.478 506.392 362.165 C 496.862 352.447 485.96 344.127 471.889 341.187 C 462.571 339.24 448.779 343.182 444.325 350.29 C 434.056 366.681 436.221 387.306 448.941 402.549 M 683.689 424.023 C 698.362 423.029 712.042 419.758 723.812 409.921 C 737.316 398.635 743.572 384.472 741.728 367.286 C 741.109 361.508 738.303 355.33 734.773 350.629 C 726.896 340.14 715.757 339.258 703.801 342.554 C 691.579 345.923 682.057 353.654 673.43 362.234 C 663.386 372.224 653.977 382.905 644.869 393.768 C 636.535 403.707 628.969 414.29 620.857 424.86 C 623.211 425.325 624.965 425.992 626.709 425.967 C 644.636 425.706 662.562 425.343 680.486 424.956 C 681.253 424.939 682.009 424.412 683.689 424.023 Z"/>
        <path opacity="1.000000" stroke="none" fill="currentColor" d="M 343.999 709.999 C 344.332 743.7 344.695 776.942 344.962 810.184 C 344.998 814.745 342.393 817.011 337.813 817.004 C 329.318 816.989 320.823 817.053 312.329 816.979 C 307.083 816.933 305.026 814.731 305.006 809.435 C 304.99 805.018 305.003 800.6 305.003 795.171 C 300.063 799.485 296.159 803.414 291.748 806.653 C 274.645 819.211 255.135 824.239 234.362 821.725 C 219.526 819.929 205.789 814.089 193.819 804.432 C 183.671 796.246 175.117 786.77 169.13 775.331 C 163.743 765.038 159.66 754.324 158.71 742.268 C 157.717 729.673 158.063 717.437 160.973 705.215 C 164.541 690.236 171.623 677.164 181.809 665.606 C 192.828 653.101 206.148 643.999 221.858 638.838 C 235.644 634.308 249.83 633.208 264.487 634.741 C 276.34 635.98 287.448 638.817 297.966 644.058 C 313.082 651.591 324.889 662.651 333.19 677.537 C 338.798 687.595 342.62 698.121 343.999 709.999 M 299.009 702.664 C 292.497 687.205 280.438 677.938 264.641 674.174 C 246.957 669.96 231.085 674.973 217.53 686.957 C 196.537 705.516 194.367 739.13 209.261 760.627 C 217.793 772.94 228.941 781.27 244.755 783.284 C 261.515 785.42 275.916 781.744 287.643 769.774 C 302.541 754.568 304.669 735.4 302.661 715.401 C 302.253 711.339 300.341 707.427 299.009 702.664 Z"/>
        <path opacity="1.000000" stroke="none" fill="currentColor" d="M 963.741 637.029 C 988.521 645.462 1005.06 662.188 1016.57 684.905 C 1024.7 700.954 1025.35 717.908 1024.91 735.164 C 1024.79 739.79 1020.38 742.852 1014.66 742.888 C 1003.49 742.96 992.329 742.913 981.165 742.912 C 952.339 742.911 923.512 742.907 894.686 742.905 C 892.209 742.904 889.733 742.905 886.912 742.905 C 890.356 756.167 895.091 768.166 905.484 776.882 C 912.787 783.006 921.132 787.016 930.876 788.08 C 952.925 790.486 971.706 783.505 988.466 769.468 C 990.118 768.084 994.862 768.251 996.71 769.641 C 1002.23 773.797 1007.11 778.841 1012.08 783.69 C 1015.23 786.752 1016.27 789.714 1012.81 793.877 C 1002.22 806.644 988.461 814.091 972.98 818.903 C 958.537 823.394 943.584 825.111 928.689 823.747 C 910.128 822.048 893.366 814.889 878.634 803.145 C 862.295 790.119 852.739 773.237 847.85 753.059 C 843.193 733.836 843.972 715.004 850.085 696.458 C 860.401 665.162 881.93 645.059 913.564 636.518 C 924.748 633.498 936.575 632.595 948.319 634.933 C 953.261 635.917 958.317 636.33 963.741 637.029 M 981.976 706.908 C 981.652 705.998 981.227 705.11 981.019 704.175 C 978.837 694.357 974.111 685.799 966.579 679.33 C 955.225 669.579 941.857 667.299 927.187 669.906 C 907.788 673.353 891.976 689.925 888.341 710.092 C 918.703 710.092 949.017 710.112 979.33 709.996 C 980.224 709.992 981.112 708.564 981.976 706.908 Z"/>
        <path opacity="1.000000" stroke="none" fill="currentColor" d="M 650.647 640.076 C 658.917 640.064 666.746 640.038 674.575 640.069 C 682.763 640.101 685.973 643.277 685.975 651.301 C 685.985 682.452 686.112 713.603 685.919 744.753 C 685.857 754.731 688.062 763.863 694.309 771.611 C 700.177 778.889 708.523 782.139 717.437 784.021 C 726.459 785.925 735.203 784.869 743.992 782.161 C 759.206 777.475 767.163 766.798 769.985 751.768 C 770.798 747.438 770.996 742.942 771.008 738.52 C 771.09 709.035 771.04 679.55 771.045 650.066 C 771.047 642.543 773.478 640.116 781.13 640.056 C 787.626 640.005 794.134 640.269 800.618 639.979 C 810.33 639.544 810.928 642.657 811.764 650.967 C 812.377 657.068 811.883 663.282 811.883 669.445 C 811.883 694.599 812.16 719.757 811.744 744.904 C 811.583 754.611 811.126 764.453 807.068 773.699 C 800.677 788.263 791.139 799.997 777.77 808.758 C 767.425 815.538 755.934 819.663 744.071 821.643 C 729.331 824.102 714.396 824.058 699.703 819.402 C 690.688 816.545 682.14 813.181 674.09 808.11 C 666.258 803.177 660.05 796.663 655.28 789.16 C 648.791 778.952 644.976 767.627 644.934 755.146 C 644.813 720.059 644.38 684.973 644.069 649.886 C 644.029 645.313 645.055 641.409 650.647 640.076 Z"/>
        <path opacity="1.000000" stroke="none" fill="currentColor" d="M 570.002 741 C 570.002 685.376 570.002 630.251 570.003 575.127 C 570.004 568.66 572.659 566.03 579.276 566.007 C 586.77 565.981 594.265 565.987 601.759 566.005 C 608.126 566.021 609.997 567.868 609.997 574.089 C 609.999 651.862 609.999 729.636 609.999 807.41 C 609.998 815.58 610.079 816.385 601.946 817.221 C 593.501 818.089 584.874 817.213 576.328 817.044 C 570.964 816.937 570.003 813.297 570.003 808.948 C 570.004 786.466 570.003 763.983 570.002 741 Z"/>
    </svg>
  `

  // Enhanced email styles with light/dark theme support and email client compatibility
  const emailStyles = `
    @media (prefers-color-scheme: dark) {
      body { color: #e5e7eb !important; background-color: #111827 !important; }
      .container { background: rgba(17, 24, 39, 0.95) !important; border: 1px solid rgba(75, 85, 99, 0.3) !important; }
      .glassmorphism-card { background: rgba(31, 41, 55, 0.8) !important; border: 1px solid rgba(75, 85, 99, 0.4) !important; }
      .text { color: #e5e7eb !important; }
      .heading { color: #ffffff !important; }
      .footer { color: #9ca3af !important; }
      .logo svg { color: #ffffff !important; }
    }
    @media only screen and (max-width: 600px) {
      .container { padding: 20px !important; margin: 10px !important; }
      .logo svg { width: 180px !important; height: auto !important; }
      .glassmorphism-card { padding: 20px !important; margin: 15px 0 !important; }
    }
    .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
    .glassmorphism-card {
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 16px;
      padding: 30px;
      margin: 25px 0;
      box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
    }
  `

  return (
    <Html>
      <Head>
        <title>Welcome to aclue - AI-Powered Gift Discovery!</title>
        <style>{emailStyles}</style>
      </Head>
      <Body style={main}>
        <Container className="container" style={container}>
          {/* Logo Section */}
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <div dangerouslySetInnerHTML={{ __html: aclueLogoSvg }} />
          </div>

          <Heading style={h1} className="heading">Welcome to aclue!</Heading>

          <Text style={text} className="text">
            Thank you for subscribing to our newsletter. You're now part of the aclue community, where AI-powered gifting meets personalised discovery.
          </Text>

          <Text style={text} className="text">
            We'll keep you updated with the latest features, intelligent gift recommendations, and exclusive early access to new capabilities.
          </Text>

          {/* Glassmorphism Feature Card */}
          <div className="glassmorphism-card" style={glassmorphismCard}>
            <Heading style={cardHeading}>🎁 What makes aclue special?</Heading>
            <Text style={cardText}>
              <strong>🧠 AI-Powered Intelligence:</strong> Our advanced algorithms learn your preferences and suggest perfect gifts.<br/><br/>
              <strong>🎯 Personalised Matching:</strong> Every recommendation is tailored specifically to you and your recipients.<br/><br/>
              <strong>📱 Seamless Discovery:</strong> Browse, save, and organise gift ideas with our intuitive interface.<br/><br/>
              <strong>🔔 Smart Notifications:</strong> Never miss the perfect gift with our intelligent alert system.
            </Text>
          </div>

          <Text style={text} className="text">
            Get ready to transform how you discover and give gifts. The future of thoughtful gifting starts here.
          </Text>

          <Text style={footer} className="footer">
            Welcome aboard!<br />
            <strong>The aclue Team</strong><br />
            <em>AI-powered gifting platform</em>
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

// Styles matching backend email service template with enhanced compatibility
const main = {
  backgroundColor: '#ffffff',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
  margin: '0',
  padding: '0',
}

const container = {
  maxWidth: '600px',
  margin: '0 auto',
  padding: '40px 20px',
  backgroundColor: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.3)',
  borderRadius: '16px',
  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
}

const h1 = {
  fontSize: '28px',
  fontWeight: 'bold',
  color: '#1f2937',
  textAlign: 'center' as const,
  margin: '0 0 25px 0',
  lineHeight: '1.3',
}

const text = {
  fontSize: '16px',
  lineHeight: '1.6',
  color: '#374151',
  margin: '0 0 20px 0',
}

const glassmorphismCard = {
  background: 'rgba(255, 255, 255, 0.1)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  borderRadius: '16px',
  padding: '30px',
  margin: '25px 0',
  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
}

const cardHeading = {
  fontSize: '20px',
  fontWeight: 'bold',
  color: '#1f2937',
  margin: '0 0 20px 0',
  textAlign: 'center' as const,
}

const cardText = {
  fontSize: '16px',
  lineHeight: '1.7',
  color: '#374151',
  margin: '0',
}

const footer = {
  fontSize: '16px',
  color: '#6b7280',
  textAlign: 'center' as const,
  margin: '30px 0 0 0',
  lineHeight: '1.5',
}
