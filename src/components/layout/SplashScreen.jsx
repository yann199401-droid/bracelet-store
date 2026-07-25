'use client'

import { useState, useEffect } from 'react'

export default function SplashScreen() {
  const [visible, setVisible] = useState(true)
  const [fadeOut, setFadeOut] = useState(false)

  useEffect(() => {
    if (sessionStorage.getItem('splashSeen')) {
      setVisible(false)
      return
    }

    const fadeTimer = setTimeout(() => {
      setFadeOut(true)
      setTimeout(() => {
        setVisible(false)
        sessionStorage.setItem('splashSeen', 'true')
      }, 600)
    }, 2600)

    return () => clearTimeout(fadeTimer)
  }, [])

  if (!visible) return null

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-chinese-ink flex items-center justify-center
        transition-opacity duration-600 ease-out
        ${fadeOut ? 'opacity-0' : 'opacity-100'}`}
    >
      <div className="text-center">
        {/* SVG: circle border + stroke-by-stroke "禅" */}
        <div className="w-[160px] h-[160px] mx-auto">
          <svg viewBox="0 0 1024 1024" className="w-full h-full">
            <style>{`
              @keyframes strokeDraw {
                to { stroke-dashoffset: 0; }
              }
              @keyframes circleReveal {
                0% { opacity: 0; transform: scale(0.8) rotate(-15deg); }
                100% { opacity: 0.5; transform: scale(1) rotate(0deg); }
              }
              .ch-stroke {
                stroke-dasharray: 3400;
                stroke-dashoffset: 3400;
                animation: strokeDraw 0.35s ease-out forwards;
                animation-delay: var(--d);
                stroke-width: 120;
                stroke-linecap: round;
                stroke-linejoin: round;
                fill: none;
                stroke: #D4A84B;
                pathLength: 3333;
              }
              .ch-circle {
                animation: circleReveal 0.6s ease-out forwards;
                transform-origin: center;
              }
            `}</style>

            {/* Circle border — fades in with rotate */}
            <circle cx="512" cy="512" r="430" fill="none" stroke="#D4A84B" strokeWidth="8"
                    className="ch-circle" opacity="0" />

            {/* Clip paths — each stroke is clipped to its calligraphic shape */}
            <defs>
              <clipPath id="c1"><use href="#s1" /></clipPath>
              <clipPath id="c2"><use href="#s2" /></clipPath>
              <clipPath id="c3"><use href="#s3" /></clipPath>
              <clipPath id="c4"><use href="#s4" /></clipPath>
              <clipPath id="c5"><use href="#s5" /></clipPath>
              <clipPath id="c6"><use href="#s6" /></clipPath>
              <clipPath id="c7"><use href="#s7" /></clipPath>
              <clipPath id="c8"><use href="#s8" /></clipPath>
              <clipPath id="c9"><use href="#s9" /></clipPath>
              <clipPath id="c10"><use href="#s10" /></clipPath>
              <clipPath id="c11"><use href="#s11" /></clipPath>
              <clipPath id="c12"><use href="#s12" /></clipPath>
            </defs>

            {/* Stroke fill shapes (used as clipping boundaries) */}
            <g fill="none">
              <path id="s1" d="M264 134Q304 182 345 203Q361 206 371 191Q377 178 374 160Q362 117 277 92Q259 88 249 91Q242 92 245 106Q246 119 264 134Z" />
              <path id="s2" d="M256 524Q281 487 311 442Q345 387 392 351Q408 339 396 324Q377 308 347 298Q325 289 307 301Q226 355 83 362Q70 359 67 368Q64 378 79 388Q116 416 134 413Q159 407 269 365Q285 359 288 366Q294 376 281 398Q202 554 36 713Q21 723 24 727Q27 730 40 725Q130 679 232 556C248 535 248 535 256 524Z" />
              <path id="s3" d="M232 556Q266 625 232 799Q214 850 251 898Q252 898 254 901Q270 916 282 891Q295 852 295 809Q294 640 299 601Q306 576 297 566Q266 529 256 524C245 516 227 544 232 556Z" />
              <path id="s4" d="M332 501Q372 562 391 565Q403 566 410 552Q413 540 406 522Q399 509 381 499Q353 481 339 478Q332 475 329 485Q328 492 332 501Z" />
              <path id="s5" d="M508 191Q530 215 554 244Q566 257 580 259Q590 259 597 247Q603 234 598 204Q591 171 509 144Q494 140 488 141Q484 144 483 157Q484 167 508 191Z" />
              <path id="s6" d="M713 130Q703 154 645 245Q638 264 654 258Q702 222 761 169Q777 151 801 138Q822 125 808 109Q793 93 765 82Q740 70 727 75Q714 78 720 91Q726 110 713 130Z" />
              <path id="s7" d="M456 344Q447 341 437 340Q425 337 423 343Q417 349 425 363Q456 423 475 521Q479 551 496 570Q514 589 518 575Q519 566 521 556C520 539 520 539 520 531Q519 521 517 510Q493 399 490 372C487 358 470 347 456 344Z" />
              <path id="s8" d="M739 525Q740 531 742 537Q748 553 760 551Q773 550 780 535Q793 519 815 434Q830 385 865 355Q883 340 867 325Q851 309 802 284Q789 275 722 292Q689 292 558 324Q497 337 456 344C442 346 476 377 490 372Q524 359 585 349C619 342 619 342 636 339Q751 315 771 325Q781 331 776 363Q757 463 747 496C744 506 737 515 739 525Z" />
              <path id="s9" d="M661 441Q692 434 720 430Q741 426 733 415Q723 402 701 399Q688 398 666 402C628 413 628 413 609 419Q578 428 550 437Q535 440 554 453Q561 459 579 456Q594 452 609 450C644 444 644 444 661 441Z" />
              <path id="s10" d="M659 536Q701 529 739 525C749 523 756 500 747 496Q726 486 659 505C626 512 626 512 609 515Q563 522 520 531C512 533 513 556 521 556Q528 556 539 555Q575 548 609 544C642 539 642 539 659 536Z" />
              <path id="s11" d="M658 677Q712 671 895 671Q914 671 919 662Q923 652 908 638Q851 593 805 612Q745 622 658 637C625 642 625 642 608 644Q505 656 388 671Q369 672 383 689Q396 702 414 708Q433 712 449 709Q524 690 608 682C641 679 641 679 658 677Z" />
              <path id="s12" d="M611 912Q615 936 622 945Q628 952 635 950Q648 941 655 885Q656 857 658 677C658 650 658 650 658 637Q658 594 659 536C659 515 659 515 659 505Q660 481 661 455Q661 448 661 441C664 415 664 415 666 402Q669 389 671 379Q674 361 660 353Q647 344 636 339C620 333 576 334 585 349Q591 358 596 369Q606 388 609 419C609 440 609 440 609 450Q609 480 609 515C609 534 609 534 609 544Q608 590 608 644C608 669 608 669 608 682Q602 821 611 912Z" />
            </g>

            {/* Animated strokes — each drawn in order */}
            <g>
              <path className="ch-stroke" style={{ '--d': '0.15s' }} clipPath="url(#c1)" d="M250 95L367 191" />
              <path className="ch-stroke" style={{ '--d': '0.25s' }} clipPath="url(#c2)" d="M74 371L139 384L304 332L346 355L177 590L30 722" />
              <path className="ch-stroke" style={{ '--d': '0.35s' }} clipPath="url(#c3)" d="M258 531L274 596L261 902" />
              <path className="ch-stroke" style={{ '--d': '0.45s' }} clipPath="url(#c4)" d="M336 484L403 554" />
              <path className="ch-stroke" style={{ '--d': '0.55s' }} clipPath="url(#c5)" d="M492 148L571 215L581 255" />
              <path className="ch-stroke" style={{ '--d': '0.65s' }} clipPath="url(#c6)" d="M725 85L764 125L650 252" />
              <path className="ch-stroke" style={{ '--d': '0.75s' }} clipPath="url(#c7)" d="M428 344L464 383L508 575" />
              <path className="ch-stroke" style={{ '--d': '0.85s' }} clipPath="url(#c8)" d="M464 344L791 307L825 345L755 545" />
              <path className="ch-stroke" style={{ '--d': '0.95s' }} clipPath="url(#c9)" d="M551 443L728 417" />
              <path className="ch-stroke" style={{ '--d': '1.05s' }} clipPath="url(#c10)" d="M525 548L742 502" />
              <path className="ch-stroke" style={{ '--d': '1.15s' }} clipPath="url(#c11)" d="M385 680L818 639L915 653" />
              <path className="ch-stroke" style={{ '--d': '1.25s' }} clipPath="url(#c12)" d="M594 350L638 394L630 944" />
            </g>
          </svg>
        </div>

        {/* Brand name */}
        <div className="opacity-0 animate-splashFadeSlide mt-5"
             style={{ animationDelay: '1.5s', animationFillMode: 'forwards' }}>
          <p className="text-chinese-gold font-serif text-xl tracking-[0.2em]">禅意手作</p>
        </div>

        {/* Tagline */}
        <div className="opacity-0 animate-splashFadeSlide mt-2"
             style={{ animationDelay: '1.8s', animationFillMode: 'forwards' }}>
          <p className="text-gray-500 text-xs tracking-[0.3em]">Zen Craft Bracelets</p>
        </div>
      </div>
    </div>
  )
}
