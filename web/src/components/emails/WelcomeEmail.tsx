import React from 'react'

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
 * - SVG logo with responsive sizing for mobile
 * - Enhanced glassmorphism design elements
 * - Structured content with clear sections and dividers
 * - Mobile-optimised typography and spacing
 * - Subscription confirmation with expectation setting
 * - Feature showcase highlighting aclue capabilities
 * - Early access badge for exclusivity
 * - Accessible HTML structure with improved hierarchy
 * - Email client fallbacks and compatibility fixes
 *
 * Design improvements include:
 * - Reorganised content structure with logical flow
 * - Enhanced mobile responsiveness
 * - Better visual hierarchy and typography
 * - Subtle section dividers for improved readability
 * - Truthful messaging appropriate for subscription confirmation
 */
export default function WelcomeEmail({ email, source = 'newsletter' }: WelcomeEmailProps) {
  // White aclue logo with text - responsive sizing for mobile optimisation
  const aclueLogoSvg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="158.2 172.5 866.8 866.8" style="width: clamp(120px, 25vw, 180px); height: clamp(120px, 25vw, 180px); max-width: 100%; display: block; margin: 0 auto;">
      <path opacity="1.000000" stroke="none" fill="#ffffff" d="M 728.698 445.693 C 718.14 449.277 708.093 453.725 697.58 455.737 C 675.804 459.904 653.625 460.217 631.481 459.987 C 631.024 459.982 630.565 460.198 629.329 460.502 C 632.26 464.601 634.777 468.59 637.754 472.199 C 649.558 486.503 661.654 500.569 673.303 514.997 C 676.476 518.926 679.331 523.543 680.815 528.316 C 683.74 537.723 678.671 544.124 673.093 547.35 C 667.794 550.415 661.325 549.608 655.359 543.647 C 646.945 535.241 639.108 526.249 631.167 517.379 C 624.196 509.593 617.242 501.779 610.613 493.704 C 604.19 485.88 598.193 477.706 592.002 469.692 C 591.513 469.059 590.965 468.473 590.327 467.728 C 585.099 473.791 579.998 479.674 574.934 485.589 C 569.381 492.074 563.938 498.655 558.311 505.075 C 550.156 514.38 542.032 523.72 533.592 532.762 C 529.152 537.519 524.197 541.828 519.228 546.05 C 515.811 548.953 511.629 548.773 507.711 547.124 C 502.466 544.917 498.742 541.28 497.992 535.25 C 496.855 526.1 501.765 519.669 507.285 513.242 C 519.998 498.442 532.484 483.445 544.964 468.446 C 546.897 466.123 548.313 463.37 550.348 460.231 C 548.422 460.141 546.889 460.046 545.354 460.003 C 532.921 459.655 520.472 459.594 508.058 458.91 C 490.608 457.947 473.314 455.234 457.179 448.442 C 430.455 437.193 411.426 418.608 406.117 388.928 C 401.768 364.62 407.219 342.853 424.762 324.7 C 432.148 317.057 440.163 310.66 451.085 308.954 C 464.746 306.821 478.208 307.26 491.071 312.719 C 505.306 318.76 517.671 327.73 529.307 337.845 C 546.67 352.937 560.848 370.784 574.588 389.061 C 579.178 395.166 584.151 400.982 589.06 407.069 C 596.373 398.495 603.969 390.146 610.939 381.303 C 625.282 363.106 640.23 345.588 658.407 330.961 C 670.077 321.57 682.376 313.173 696.955 309.806 C 720.725 304.318 741.868 307.576 759.445 329.641 C 772.237 345.699 776.494 363.74 774.748 383.317 C 773.146 401.275 765.673 416.834 752.202 429.431 C 745.194 435.985 737.71 441.525 728.698 445.693 M 448.941 402.549 C 454.247 407.039 458.993 412.556 464.968 415.822 C 481.176 424.683 499.531 424.395 517.279 425.837 C 529.523 426.832 541.914 426.048 554.239 425.996 C 555.75 425.989 557.26 425.585 559.58 425.248 C 552.884 416.684 547.009 408.653 540.593 401.081 C 529.426 387.903 518.466 374.478 506.392 362.165 C 496.862 352.447 485.96 344.127 471.889 341.187 C 462.571 339.24 448.779 343.182 444.325 350.29 C 434.056 366.681 436.221 387.306 448.941 402.549 M 683.689 424.023 C 698.362 423.029 712.042 419.758 723.812 409.921 C 737.316 398.635 743.572 384.472 741.728 367.286 C 741.109 361.508 738.303 355.33 734.773 350.629 C 726.896 340.14 715.757 339.258 703.801 342.554 C 691.579 345.923 682.057 353.654 673.43 362.234 C 663.386 372.224 653.977 382.905 644.869 393.768 C 636.535 403.707 628.969 414.29 620.857 424.86 C 623.211 425.325 624.965 425.992 626.709 425.967 C 644.636 425.706 662.562 425.343 680.486 424.956 C 681.253 424.939 682.009 424.412 683.689 424.023 Z" style="transform-origin: 591.611px 433.4px 0px;"/>
      <path opacity="1.000000" stroke="none" fill="#ffffff" d="M 343.999 709.999 C 344.332 743.7 344.695 776.942 344.962 810.184 C 344.998 814.745 342.393 817.011 337.813 817.004 C 329.318 816.989 320.823 817.053 312.329 816.979 C 307.083 816.933 305.026 814.731 305.006 809.435 C 304.99 805.018 305.003 800.6 305.003 795.171 C 300.063 799.485 296.159 803.414 291.748 806.653 C 274.645 819.211 255.135 824.239 234.362 821.725 C 219.526 819.929 205.789 814.089 193.819 804.432 C 183.671 796.246 175.117 786.77 169.13 775.331 C 163.743 765.038 159.66 754.324 158.71 742.268 C 157.717 729.673 158.063 717.437 160.973 705.215 C 164.541 690.236 171.623 677.164 181.809 665.606 C 192.828 653.101 206.148 643.999 221.858 638.838 C 235.644 634.308 249.83 633.208 264.487 634.741 C 276.34 635.98 287.448 638.817 297.966 644.058 C 313.082 651.591 324.889 662.651 333.19 677.537 C 338.798 687.595 342.62 698.121 343.999 709.999 M 299.009 702.664 C 292.497 687.205 280.438 677.938 264.641 674.174 C 246.957 669.96 231.085 674.973 217.53 686.957 C 196.537 705.516 194.367 739.13 209.261 760.627 C 217.793 772.94 228.941 781.27 244.755 783.284 C 261.515 785.42 275.916 781.744 287.643 769.774 C 302.541 754.568 304.669 735.4 302.661 715.401 C 302.253 711.339 300.341 707.427 299.009 702.664 Z" style="transform-origin: 591.611px 433.4px 0px;"/>
      <path opacity="1.000000" stroke="none" fill="#ffffff" d="M 963.741 637.029 C 988.521 645.462 1005.06 662.188 1016.57 684.905 C 1024.7 700.954 1025.35 717.908 1024.91 735.164 C 1024.79 739.79 1020.38 742.852 1014.66 742.888 C 1003.49 742.96 992.329 742.913 981.165 742.912 C 952.339 742.911 923.512 742.907 894.686 742.905 C 892.209 742.904 889.733 742.905 886.912 742.905 C 890.356 756.167 895.091 768.166 905.484 776.882 C 912.787 783.006 921.132 787.016 930.876 788.08 C 952.925 790.486 971.706 783.505 988.466 769.468 C 990.118 768.084 994.862 768.251 996.71 769.641 C 1002.23 773.797 1007.11 778.841 1012.08 783.69 C 1015.23 786.752 1016.27 789.714 1012.81 793.877 C 1002.22 806.644 988.461 814.091 972.98 818.903 C 958.537 823.394 943.584 825.111 928.689 823.747 C 910.128 822.048 893.366 814.889 878.634 803.145 C 862.295 790.119 852.739 773.237 847.85 753.059 C 843.193 733.836 843.972 715.004 850.085 696.458 C 860.401 665.162 881.93 645.059 913.564 636.518 C 924.748 633.498 936.575 632.595 948.319 634.933 C 953.261 635.917 958.317 636.33 963.741 637.029 M 981.976 706.908 C 981.652 705.998 981.227 705.11 981.019 704.175 C 978.837 694.357 974.111 685.799 966.579 679.33 C 955.225 669.579 941.857 667.299 927.187 669.906 C 907.788 673.353 891.976 689.925 888.341 710.092 C 918.703 710.092 949.017 710.112 979.33 709.996 C 980.224 709.992 981.112 708.564 981.976 706.908 Z" style="transform-origin: 591.611px 433.4px 0px;"/>
      <path opacity="1.000000" stroke="none" fill="#ffffff" d="M 650.647 640.076 C 658.917 640.064 666.746 640.038 674.575 640.069 C 682.763 640.101 685.973 643.277 685.975 651.301 C 685.985 682.452 686.112 713.603 685.919 744.753 C 685.857 754.731 688.062 763.863 694.309 771.611 C 700.177 778.889 708.523 782.139 717.437 784.021 C 726.459 785.925 735.203 784.869 743.992 782.161 C 759.206 777.475 767.163 766.798 769.985 751.768 C 770.798 747.438 770.996 742.942 771.008 738.52 C 771.09 709.035 771.04 679.55 771.045 650.066 C 771.047 642.543 773.478 640.116 781.13 640.056 C 787.626 640.005 794.134 640.269 800.618 639.979 C 810.33 639.544 810.928 642.657 811.764 650.967 C 812.377 657.068 811.883 663.282 811.883 669.445 C 811.883 694.599 812.16 719.757 811.744 744.904 C 811.583 754.611 811.126 764.453 807.068 773.699 C 800.677 788.263 791.139 799.997 777.77 808.758 C 767.425 815.538 755.934 819.663 744.071 821.643 C 729.331 824.102 714.396 824.058 699.703 819.402 C 690.688 816.545 682.14 813.181 674.09 808.11 C 666.258 803.177 660.05 796.663 655.28 789.16 C 648.791 778.952 644.976 767.627 644.934 755.146 C 644.813 720.059 644.38 684.973 644.069 649.886 C 644.029 645.313 645.055 641.409 650.647 640.076 Z" style="transform-origin: 591.611px 433.4px 0px;"/>
      <path opacity="1.000000" stroke="none" fill="#ffffff" d="M 441.191 684.215 C 431.057 691.942 424.821 701.898 422.075 713.806 C 418.191 730.644 419.84 747.144 430.264 761.175 C 438.736 772.579 449.655 781.157 464.896 783.245 C 475.164 784.652 484.981 784.006 494.052 779.821 C 501.597 776.34 508.446 771.155 515.135 766.104 C 517.777 764.11 519.655 763.754 521.979 765.52 C 526.783 769.168 531.47 772.971 536.168 776.757 C 537.199 777.589 537.979 778.739 539.032 779.536 C 545.487 784.421 545.596 787.506 540.251 793.287 C 527.749 806.807 512.967 816.467 495.002 821.003 C 473.549 826.419 452.559 825.247 432.449 815.751 C 410.164 805.229 394.305 788.635 384.708 765.626 C 379.236 752.507 377.85 739.042 378.146 725.32 C 378.671 700.96 387.441 679.432 404.231 661.914 C 417.372 648.203 433.522 639.222 452.723 635.846 C 469.576 632.882 485.973 633.686 502.079 639.07 C 517.862 644.345 531.399 653.196 541.793 666.372 C 545.581 671.174 544.58 674.457 539.593 678.124 C 534.048 682.204 528.674 686.543 523.474 691.056 C 520.439 693.69 517.882 693.811 514.81 691.322 C 507.121 685.09 499.617 678.858 489.781 675.674 C 477.853 671.814 466.384 671.766 454.979 676.562 C 450.267 678.544 445.953 681.47 441.191 684.215 Z" style="transform-origin: 591.611px 433.4px 0px;"/>
      <path opacity="1.000000" stroke="none" fill="#ffffff" d="M 570.002 741 C 570.002 685.376 570.002 630.251 570.003 575.127 C 570.004 568.66 572.659 566.03 579.276 566.007 C 586.77 565.981 594.265 565.987 601.759 566.005 C 608.126 566.021 609.997 567.868 609.997 574.089 C 609.999 651.862 609.999 729.636 609.999 807.41 C 609.998 815.58 610.079 816.385 601.946 817.221 C 593.501 818.089 584.874 817.213 576.328 817.044 C 570.964 816.937 570.003 813.297 570.003 808.948 C 570.004 786.466 570.003 763.983 570.002 741 Z" style="transform-origin: 591.611px 433.4px 0px;"/>
</svg>
  `;


  // WCAG AA Compliant email styles with accessibility-focused design
  const emailStyles = `
    @media (prefers-color-scheme: dark) {
      .container { background: #18181b !important; color: #e4e4e7 !important; }
      .header { background: #27272a !important; }
      .content { background: #27272a !important; }
      .glassmorphism-card { background: #3f3f46 !important; border: 1px solid #52525b !important; }
      .section-divider { border-top: 1px solid #52525b !important; }
      .early-access-badge { background: #3f3f46 !important; border: 1px solid #0ea5e9 !important; }
      .footer { color: #e4e4e7 !important; }
      .footer a { color: #0ea5e9 !important; }
      .footer div[style*="background: #f8fafc"] { background: #27272a !important; border-color: #52525b !important; }
      .footer div[style*="border-top: 1px solid #e2e8f0"] { border-color: #52525b !important; }
      .footer a[style*="background: #fef2f2"] { background: #3f3f46 !important; border-color: #ef4444 !important; }
      .heading-text { color: #e4e4e7 !important; }
      .lead-text { color: #e4e4e7 !important; }
      .body-text { color: #e4e4e7 !important; }
      .section-heading { color: #e4e4e7 !important; }
      .card-heading { color: #e4e4e7 !important; }
      .card-text { color: #e4e4e7 !important; }
      .badge-text { color: #e4e4e7 !important; }
      .badge-secondary { color: #e4e4e7 !important; }
    }

    @media only screen and (max-width: 600px) {
      .container { padding: 16px !important; }
      .header { padding: 32px 20px !important; }
      .content { padding: 24px 20px !important; }
      .glassmorphism-card { padding: 20px !important; margin: 20px 0 !important; }
      .early-access-badge { padding: 16px !important; margin: 16px 0 !important; }
      .section-divider { margin: 24px 0 !important; }
    }

    .section-divider {
      border: 0;
      border-top: 1px solid #bae6fd;
      margin: 32px 0;
      height: 0;
    }

    .early-access-badge {
      background: #f0f9ff;
      border: 1px solid #0ea5e9;
      border-radius: 12px;
      padding: 20px;
      margin: 24px 0;
      text-align: center;
    }
  `

  // Container styles with responsive design
  const container = {
    margin: '0 auto',
    padding: '20px',
    width: '100%',
    maxWidth: '600px',
  }

  // Email wrapper styles for header and content sections
  const emailWrapper = {
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 8px 32px rgba(14, 165, 233, 0.25)',
  }

  // Header styles with WCAG-compliant solid background
  const header = {
    background: '#27272a',
    color: '#e4e4e7',
    padding: '40px 30px 32px 30px',
    textAlign: 'center' as const,
    borderRadius: '12px 12px 0 0',
  }

  // Content section styles with WCAG-compliant white background
  const content = {
    background: '#ffffff',
    padding: '32px 30px',
    borderRadius: '0 0 12px 12px',
    color: '#18181b',
    lineHeight: '1.6',
  }

  // Heading styles with enhanced typography
  const h1 = {
    fontSize: 'clamp(24px, 5vw, 32px)',
    fontWeight: 'bold',
    marginBottom: '0',
    marginTop: '0',
    color: '#e4e4e7',
    textAlign: 'center' as const,
    lineHeight: '1.2',
  }

  const sectionHeading = {
    fontSize: '20px',
    fontWeight: '600',
    marginBottom: '12px',
    marginTop: '0',
    color: '#18181b',
    textAlign: 'left' as const,
  }

  const cardHeading = {
    fontSize: '22px',
    fontWeight: 'bold',
    marginBottom: '16px',
    marginTop: '0',
    color: '#18181b',
    textAlign: 'center' as const,
  }

  // WCAG-compliant text styles with proper contrast ratios
  const text = {
    fontSize: '16px',
    lineHeight: '1.6',
    marginBottom: '16px',
    marginTop: '0',
    color: '#3f3f46',
  }

  const leadText = {
    fontSize: '18px',
    lineHeight: '1.6',
    marginBottom: '20px',
    marginTop: '0',
    color: '#27272a',
    fontWeight: '500',
  }

  const cardText = {
    fontSize: '16px',
    lineHeight: '1.7',
    color: '#18181b',
    textAlign: 'left' as const,
    marginBottom: '0',
  }

  // WCAG-compliant card styles with solid backgrounds
  const glassmorphismCard = {
    background: '#f0f9ff',
    border: '1px solid #bae6fd',
    borderRadius: '16px',
    padding: '28px',
    margin: '28px 0',
    boxShadow: '0 4px 16px rgba(14, 165, 233, 0.1)',
  }

  // WCAG-compliant early access badge styles
  const earlyAccessBadge = {
    background: '#f0f9ff',
    border: '1px solid #0ea5e9',
    borderRadius: '12px',
    padding: '20px',
    margin: '24px 0',
    textAlign: 'center' as const,
  }

  // WCAG-compliant section divider styles
  const sectionDivider = {
    border: '0',
    borderTop: '1px solid #bae6fd',
    margin: '32px 0',
    height: '0',
  }

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', lineHeight: 1.6, color: '#333', margin: 0, padding: 0 }}>
      <style>{emailStyles}</style>
      <div style={container} className="container">
        <div style={emailWrapper} className="email-wrapper">
          {/* Logo + Welcome Header */}
          <div style={header} className="header">
          <div dangerouslySetInnerHTML={{ __html: aclueLogoSvg }} />
          <h1 style={h1} className="heading heading-text">Welcome!</h1>
        </div>

        <div style={content} className="content">
          {/* Personal Introduction Section */}
          <section>
            <p style={leadText} className="lead-text">
              Hello there! We're delighted you've joined our community of thoughtful gift-givers.
            </p>
            <p style={text} className="body-text">
              aclue is where AI-powered intelligence meets personalised discovery, making gift-giving intuitive and meaningful.
            </p>
          </section>

          <hr style={sectionDivider} className="section-divider" />

          {/* Subscription Confirmation */}
          <section>
            <h2 style={sectionHeading} className="section-heading">📧 You're Successfully Subscribed</h2>
            <p style={text} className="body-text">
              You'll receive curated updates about new features,
              intelligent recommendations, and exclusive insights into the future of gifting.
            </p>
          </section>

          <hr style={sectionDivider} className="section-divider" />

          {/* Feature Showcase */}
          <section>
            <h2 style={sectionHeading} className="section-heading">What makes aclue special</h2>

            <div className="glassmorphism-card" style={glassmorphismCard}>
              <p style={cardText} className="card-text">
                <strong>🧠 Intelligent Personalisation:</strong> Our AI learns your preferences and suggests gifts that truly resonate with your recipients.
                <br /><br />
                <strong>🎯 Smart Matching:</strong> Connect with the perfect gifts through advanced recommendation algorithms.
                <br /><br />
                <strong>⭐ Curated Quality:</strong> Only the best products make it to your recommendations.
                <br /><br />
                <strong>👥 Social Integration:</strong> Connect with friends and family for better gift ideas.
              </p>
            </div>
          </section>

          <hr style={sectionDivider} className="section-divider" />

          {/* What Happens Next */}
          <section>
            <h2 style={sectionHeading} className="section-heading">🚀 What to Expect</h2>
            <p style={text} className="body-text">
              Over the coming weeks, you'll receive thoughtful updates as we continue building aclue.
              We'll share behind-the-scenes insights, new features as they launch, and exclusive early access opportunities.
            </p>
            <p style={text} className="body-text">
              No spam, no noise - just valuable content delivered when it matters.
            </p>
          </section>

          {/* Company Signature Section */}
          <div style={{
            marginTop: '32px',
            marginBottom: '32px',
            textAlign: 'center' as const
          }}>
            <p style={{
              fontSize: '18px',
              fontWeight: '600',
              marginBottom: '8px',
              marginTop: '0',
              color: '#18181b'
            }}>
              Thank you for being part of this journey!
            </p>
            <p style={{
              fontSize: '16px',
              fontWeight: '600',
              marginBottom: '4px',
              marginTop: '0',
              color: '#18181b'
            }}>
              The aclue Team
            </p>

            <p style={{ marginBottom: '0', marginTop: '0' }}>
              <a
                href="https://aclue.app"
                style={{
                  color: '#0284c7',
                  textDecoration: 'none',
                  fontSize: '16px',
                  fontWeight: '500'
                }}
              >
                aclue.app →
              </a>
            </p>
          </div>

          <hr style={sectionDivider} className="section-divider" />

          {/* Footer with Company Info and Legal Compliance */}
          <footer style={{
            marginTop: '0',
            padding: '0',
            textAlign: 'center' as const,
            fontSize: '16px',
            lineHeight: '1.6',
            color: '#52525b'
          }} className="footer">

            {/* Privacy Rights and Legal Section */}
            <div style={{
              background: 'transparent',
              border: 'none',
              borderRadius: '12px',
              padding: '0',
              marginTop: '0',
              textAlign: 'left' as const
            }}>
              <h3 style={{
                fontSize: '16px',
                fontWeight: '600',
                marginBottom: '16px',
                marginTop: '0',
                color: '#18181b',
                textAlign: 'center' as const
              }}>
                Your Privacy & Rights
              </h3>

              <p style={{
                fontSize: '14px',
                lineHeight: '1.6',
                marginBottom: '20px',
                marginTop: '0',
                color: '#3f3f46',
                textAlign: 'center' as const
              }}>
                We respect your privacy and data rights under GDPR. You have the right to access, update, or delete your personal data at any time.
              </p>

              {/* Quick Actions */}
              <div style={{
                textAlign: 'center' as const,
                marginBottom: '4px'
              }}>
                <a href="https://aclue.app/unsubscribe"
                  style={{
                    display: 'inline-block',
                    background: 'transparent',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '12px 20px',
                    color: '#dc2626',
                    textDecoration: 'underline',
                    fontSize: '14px',
                    fontWeight: '600',
                    margin: '0 8px 8px 0'
                  }}>
                  Unsubscribe
                </a>
              </div>

              {/* Legal Links */}
              <div style={{
                borderTop: 'none',
                paddingTop: '8px',
                textAlign: 'center' as const
              }}>
                <p style={{
                  fontSize: '14px',
                  marginBottom: '16px',
                  marginTop: '0',
                  lineHeight: '1.6'
                }}>
                  <a href="https://aclue.app/privacy"
                    style={{
                      color: '#0284c7',
                      textDecoration: 'none',
                      fontWeight: '500'
                    }}>
                    Privacy Policy
                  </a>
                  <span style={{ color: '#94a3b8', margin: '0 8px' }}>•</span>
                  <a href="https://aclue.app/terms"
                    style={{
                      color: '#0284c7',
                      textDecoration: 'none',
                      fontWeight: '500'
                    }}>
                    Terms of Service
                  </a>
                  <span style={{ color: '#94a3b8', margin: '0 8px' }}>•</span>
                  <a href="https://aclue.app/data-rights"
                    style={{
                      color: '#0284c7',
                      textDecoration: 'none',
                      fontWeight: '500'
                    }}>
                    Data Rights
                  </a>
                </p>
              </div>

              {/* Company Information */}
              <div style={{
                borderTop: 'none',
                paddingTop: '20px',
                textAlign: 'center' as const
              }}>
                <p style={{
                  fontSize: '13px',
                  fontWeight: '600',
                  marginBottom: '4px',
                  marginTop: '0',
                  color: '#18181b'
                }}>
                  aclue Limited
                </p>
                <p style={{
                  fontSize: '13px',
                  marginBottom: '0',
                  marginTop: '0',
                  color: '#3f3f46',
                  lineHeight: '1.5'
                }}>
                  71-75 Shelton Street, Covent Garden<br />
                  London WC2H 9JQ, United Kingdom
                </p>
              </div>
            </div>
          </footer>
        </div>
        </div>
      </div>
    </div>
  )
}
