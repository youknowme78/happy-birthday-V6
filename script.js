/* =========================================================
   PAGE NAVIGATION
========================================================= */

function goTo(pageId) {

    const currentPage =
        document.querySelector(".screen.active");

    const nextPage =
        document.getElementById(pageId);

    if (!nextPage) {
        return;
    }

    if (currentPage) {
        currentPage.classList.remove("active");
    }

    setTimeout(() => {
        nextPage.classList.add("active");
    }, 80);
}


/* =========================================================
   FAST + SAFE MOVING BUTTON SYSTEM
========================================================= */

function makeButtonRunAway(button, area) {

    if (!button || !area) {
        return;
    }


    /*
    ---------------------------------------------------------
    SETTINGS
    ---------------------------------------------------------
    */

    const escapeDistance = 120;

    const escapeCooldown = 300;

    const movementDuration = 450;

    let lastEscapeTime = 0;

    let currentLeft = 0;

    let currentTop = 0;


    /*
    ---------------------------------------------------------
    INITIAL POSITION
    ---------------------------------------------------------
    */

    function setInitialPosition() {

        currentLeft = button.offsetLeft;

        currentTop = button.offsetTop;

    }


    /*
    ---------------------------------------------------------
    KEEP BUTTON INSIDE THE AREA
    ---------------------------------------------------------
    */

    function clamp(value, min, max) {

        return Math.max(
            min,
            Math.min(
                value,
                max
            )
        );

    }


    /*
    ---------------------------------------------------------
    MOVE BUTTON AWAY FROM CURSOR
    ---------------------------------------------------------
    */

    function escapeFromCursor(
        pointerX,
        pointerY
    ) {

        const now =
            performance.now();


        /*
        Prevent the button from
        continuously recalculating
        every single frame.
        */

        if (
            now - lastEscapeTime
            < escapeCooldown
        ) {

            return;

        }


        lastEscapeTime = now;


        const areaRect =
            area.getBoundingClientRect();


        const buttonRect =
            button.getBoundingClientRect();


        /*
        Current button center
        */

        const buttonCenterX =
            buttonRect.left +
            buttonRect.width / 2;


        const buttonCenterY =
            buttonRect.top +
            buttonRect.height / 2;


        /*
        Direction from cursor
        toward button.
        */

        let directionX =
            buttonCenterX -
            pointerX;


        let directionY =
            buttonCenterY -
            pointerY;


        /*
        Calculate distance.
        */

        let distance =
            Math.sqrt(
                directionX * directionX +
                directionY * directionY
            );


        /*
        If the cursor is almost exactly
        on the button, choose a random
        direction instead of getting stuck.
        */

        if (distance < 1) {

            const randomAngle =
                Math.random()
                * Math.PI
                * 2;


            directionX =
                Math.cos(randomAngle);


            directionY =
                Math.sin(randomAngle);


            distance = 1;

        }


        /*
        Normalize direction.
        */

        directionX /=
            distance;


        directionY /=
            distance;


        /*
        Strong movement away from cursor.
        */

        const moveDistance =
            130 +
            Math.random() * 70;


        /*
        Add a little sideways randomness
        so the button doesn't repeatedly
        move in exactly one direction.
        */

        const sideAngle =
            (
                Math.random() - 0.5
            ) * 0.9;


        const cos =
            Math.cos(sideAngle);


        const sin =
            Math.sin(sideAngle);


        const newDirectionX =
            directionX * cos -
            directionY * sin;


        const newDirectionY =
            directionX * sin +
            directionY * cos;


        /*
        Calculate desired screen position.
        */

        let desiredScreenX =
            buttonCenterX +
            newDirectionX *
            moveDistance;


        let desiredScreenY =
            buttonCenterY +
            newDirectionY *
            moveDistance;


        /*
        -----------------------------------------------------
        SAFETY BOUNDARIES

        The button is NEVER allowed
        outside the choice area.
        -----------------------------------------------------
        */

        const safeMargin = 8;


        const minScreenX =
            areaRect.left +
            safeMargin;


        const maxScreenX =
            areaRect.right -
            buttonRect.width -
            safeMargin;


        const minScreenY =
            areaRect.top +
            safeMargin;


        const maxScreenY =
            areaRect.bottom -
            buttonRect.height -
            safeMargin;


        /*
        Convert screen coordinates
        into coordinates relative
        to the choice area.
        */

        let newLeft =
            desiredScreenX -
            areaRect.left;


        let newTop =
            desiredScreenY -
            areaRect.top;


        /*
        HARD CLAMP

        This guarantees that the
        button stays inside the area.
        */

        newLeft =
            clamp(
                newLeft,
                0,
                Math.max(
                    0,
                    areaRect.width -
                    buttonRect.width
                )
            );


        newTop =
            clamp(
                newTop,
                0,
                Math.max(
                    0,
                    areaRect.height -
                    buttonRect.height
                )
            );


        /*
        -----------------------------------------------------
        SECOND SAFETY CHECK

        Make sure the destination itself
        isn't too close to the cursor.
        -----------------------------------------------------
        */

        const destinationCenterX =
            areaRect.left +
            newLeft +
            buttonRect.width / 2;


        const destinationCenterY =
            areaRect.top +
            newTop +
            buttonRect.height / 2;


        const destinationDistance =
            Math.sqrt(

                Math.pow(
                    destinationCenterX -
                    pointerX,
                    2
                )

                +

                Math.pow(
                    destinationCenterY -
                    pointerY,
                    2
                )

            );


        /*
        If destination is still too close,
        force it to the opposite side.
        */

        if (
            destinationDistance
            < escapeDistance * 0.75
        ) {

            const oppositeX =
                areaRect.left +
                areaRect.width -
                (
                    buttonRect.width +
                    newLeft
                );


            const oppositeY =
                areaRect.top +
                areaRect.height -
                (
                    buttonRect.height +
                    newTop
                );


            newLeft =
                clamp(
                    oppositeX,
                    0,
                    areaRect.width -
                    buttonRect.width
                );


            newTop =
                clamp(
                    oppositeY,
                    0,
                    areaRect.height -
                    buttonRect.height
                );

        }


        /*
        Save position.
        */

        currentLeft = newLeft;

        currentTop = newTop;


        /*
        Move smoothly.
        */

        button.style.transition =
            `left ${movementDuration}ms ease-out,
             top ${movementDuration}ms ease-out`;


        button.style.left =
            `${currentLeft}px`;


        button.style.top =
            `${currentTop}px`;

    }


    /*
    ---------------------------------------------------------
    DESKTOP MOUSE MOVEMENT
    ---------------------------------------------------------
    */

    area.addEventListener(
        "mousemove",
        function(event) {

            const buttonRect =
                button.getBoundingClientRect();


            const centerX =
                buttonRect.left +
                buttonRect.width / 2;


            const centerY =
                buttonRect.top +
                buttonRect.height / 2;


            const distance =
                Math.sqrt(

                    Math.pow(
                        event.clientX -
                        centerX,
                        2
                    )

                    +

                    Math.pow(
                        event.clientY -
                        centerY,
                        2
                    )

                );


            /*
            Escape BEFORE cursor reaches
            the button.
            */

            if (
                distance <
                escapeDistance
            ) {

                escapeFromCursor(
                    event.clientX,
                    event.clientY
                );

            }

        }
    );


    /*
    ---------------------------------------------------------
    EXTRA SAFETY:
    If cursor actually reaches button,
    immediately move it.
    ---------------------------------------------------------
    */

    button.addEventListener(
        "mouseenter",
        function(event) {

            escapeFromCursor(
                event.clientX,
                event.clientY
            );

        }
    );


    /*
    ---------------------------------------------------------
    MOBILE / TOUCH
    ---------------------------------------------------------
    */

    button.addEventListener(
        "touchstart",
        function(event) {

            event.preventDefault();


            const touch =
                event.touches[0];


            if (!touch) {
                return;
            }


            escapeFromCursor(
                touch.clientX,
                touch.clientY
            );

        },
        {
            passive: false
        }
    );


    /*
    ---------------------------------------------------------
    INITIALIZE
    ---------------------------------------------------------
    */

    setTimeout(
        setInitialPosition,
        100
    );

}


/* =========================================================
   INITIALIZE BOTH RUNNING BUTTONS
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        /*
        QUESTION 1

        YES button runs away.
        */

        const question1Area =
            document.querySelector(
                "#question1 .choice-area"
            );


        const changeYes =
            document.getElementById(
                "changeYes"
            );


        makeButtonRunAway(
            changeYes,
            question1Area
        );


        /*
        QUESTION 2

        NO button runs away.
        */

        const question2Area =
            document.querySelector(
                "#question2 .choice-area"
            );


        const waitNo =
            document.getElementById(
                "waitNo"
            );


        makeButtonRunAway(
            waitNo,
            question2Area
        );

    }
);


/* =========================================================
   ONE LAST SURPRISE
========================================================= */

function lastSurprise() {

    /*
    Don't create multiple final pages.
    */

    if (
        document.querySelector(
            ".final-note-page"
        )
    ) {

        return;

    }


    /*
    Create controlled heart burst.
    */

    createHeartBurst();


    /*
    Open final page after animation.
    */

    setTimeout(
        openFinalNote,
        1050
    );

}


/* =========================================================
   HEART BURST
========================================================= */

function createHeartBurst() {

    const hearts = [

        "❤️",
        "💖",
        "💕",
        "💗",
        "💓",
        "💞",
        "💘",
        "✨"

    ];


    /*
    Controlled number of hearts.
    */

    const numberOfHearts = 28;


    for (
        let i = 0;
        i < numberOfHearts;
        i++
    ) {

        const heart =
            document.createElement(
                "div"
            );


        heart.className =
            "burst-heart";


        heart.textContent =
            hearts[
                Math.floor(
                    Math.random() *
                    hearts.length
                )
            ];


        /*
        Random direction.
        */

        const angle =
            Math.random() *
            Math.PI *
            2;


        /*
        Random distance.
        */

        const distance =
            130 +
            Math.random() * 270;


        const x =
            Math.cos(angle) *
            distance;


        const y =
            Math.sin(angle) *
            distance;


        const rotation =
            Math.random() *
            600 -
            300;


        heart.style.setProperty(
            "--x",
            `${x}px`
        );


        heart.style.setProperty(
            "--y",
            `${y}px`
        );


        heart.style.setProperty(
            "--rotation",
            `${rotation}deg`
        );


        heart.style.fontSize =
            (
                18 +
                Math.random() * 15
            ) +
            "px";


        document.body.appendChild(
            heart
        );


        setTimeout(
            () => {

                heart.remove();

            },
            1500
        );

    }

}


/* =========================================================
   FINAL NOTE PAGE
========================================================= */

function openFinalNote() {

    if (
        document.querySelector(
            ".final-note-page"
        )
    ) {

        return;

    }


    const finalPage =
        document.createElement(
            "div"
        );


    finalPage.className =
        "final-note-page";


    finalPage.innerHTML = `

        <div
            class="final-note-container"
        >

            <!-- DECORATIVE HEARTS -->

            <div
                class="photo-decoration heart-one"
            >
                ❤️
            </div>


            <div
                class="photo-decoration heart-two"
            >
                💕
            </div>


            <div
                class="photo-decoration heart-three"
            >
                💖
            </div>


            <div
                class="photo-decoration heart-four"
            >
                💗
            </div>



            <!-- PHOTO -->

            <div
                class="final-photo-wrapper"
            >

                <div
                    class="photo-ring"
                ></div>


                <img
                    src="images/final-photo.jpg"
                    alt="A special memory"
                    class="final-photo"
                >

            </div>



            <!-- FINAL TITLE -->

            <h1
                class="final-note-title"
            >

                One Last Thing... ❤️

            </h1>



            <!-- FINAL MESSAGE -->

            <div
                class="final-note"
            >

                <!-- ✏️ CHANGE PARAGRAPH 1 -->

                <p>

                    Well....enaku epudi solrathu nu therila but happy birthday

                </p>


                <!-- ✏️ CHANGE PARAGRAPH 2 -->

                <p>

                    ennala enna panna mudiyum nu therila anaa un mogathula oru 
                    chinna siripaa pakurathu kaga i will this world upside down

                </p>


                <!-- ✏️ CHANGE PARAGRAPH 3 -->

                <p>

                    iniku poii antha nilla va paru un azhagula athu kuda vaykathula paathi mogatha marachi irukum

                </p>

            </div>



            <!-- SIGNATURE -->

            <div
                class="final-signature"
            >

                Many more happy returns of the day,

                <br>

                HARSHINI

            </div>


            <button
                class="main-btn"
                onclick="closeFinalNote()"
            >

                Keep this memory 💕

            </button>


        </div>

    `;


    document.body.appendChild(
        finalPage
    );

}


/* =========================================================
   CLOSE FINAL PAGE
========================================================= */

function closeFinalNote() {

    const finalPage = document.querySelector(".final-note-page");

    if (!finalPage) {
        return;
    }

    /* Keep the original One Last Thing page unchanged.
       The custom promise appears only after this button is clicked. */
    finalPage.style.transition = "opacity 0.35s ease";
    finalPage.style.opacity = "0";

    setTimeout(() => {
        finalPage.remove();
        openCustomPromisePopup();
    }, 350);
}


/* =========================================================
   CUSTOM PROMISE POPUP — AFTER "KEEP THIS MEMORY"
========================================================= */
function openCustomPromisePopup() {
    if (document.getElementById("custom-promise-popup")) return;

    const popup = document.createElement("div");
    popup.id = "custom-promise-popup";
    Object.assign(popup.style, {
        position: "fixed", inset: "0", zIndex: "99999",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "22px", background: "rgba(70, 25, 55, 0.58)",
        backdropFilter: "blur(7px)", opacity: "0",
        transition: "opacity 0.4s ease"
    });

    popup.innerHTML = `
        <div style="width:100%;max-width:680px;max-height:90vh;overflow-y:auto;padding:clamp(28px,6vw,52px);text-align:center;background:linear-gradient(145deg,#fffafd,#fff0f8);border:1px solid rgba(207,92,165,.25);border-radius:30px;box-shadow:0 24px 80px rgba(75,20,65,.3);color:#794064;font-family:'Poppins',sans-serif;">
            <div style="font-size:48px;margin-bottom:10px;">💗</div>
            <p style="font-size:12px;letter-spacing:3px;text-transform:uppercase;color:#a35a89;margin-bottom:14px;">A promise from my heart</p>
            <h2 style="font-family:'Dancing Script',cursive;font-size:clamp(32px,6vw,48px);font-weight:700;color:#843b70;margin:0 0 24px;">One Promise, Just for You ❤️</h2>
            <div style="font-size:clamp(15px,2.7vw,19px);line-height:1.95;overflow-wrap:anywhere;">
                <p style="margin:0 0 20px;">IF YOU ACCEPT ME — I WILL BE IN FRONT OF YOU ON OUR DARKEST DAY,</p>
                <p style="margin:0 0 20px;">YOU WILL BE IN FRONT OF ME ON OUR BRIGHTEST DAY</p>
                <p style="margin:0 0 24px;font-weight:600;color:#a13f80;">ITHU UN MELA PROMISE ❤️</p>
                <p style="margin:0;font-family:'Dancing Script',cursive;font-size:clamp(24px,4vw,34px);font-weight:700;">(MY BIGGEST GIFT: A SHOULDER TO LEAN ON FOR REST OF YOUR LIFE) 💗</p>
            </div>
            <button id="close-custom-promise" type="button" style="margin-top:30px;padding:13px 30px;border:0;border-radius:999px;background:linear-gradient(90deg,#d4429b,#ad45c7);color:white;font:600 15px 'Poppins',sans-serif;cursor:pointer;">Keep this promise 💞</button>
        </div>`;

    document.body.appendChild(popup);
    requestAnimationFrame(() => { popup.style.opacity = "1"; });

    popup.querySelector("#close-custom-promise").addEventListener("click", () => {
        popup.style.opacity = "0";
        setTimeout(() => popup.remove(), 350);
    });
}