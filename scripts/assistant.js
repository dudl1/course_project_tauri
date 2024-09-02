function visible_assistant()
{
    const panel_assistant = document.querySelector(".panel_assistant");
    panel_assistant.classList.toggle("active");
}


async function assistant(message = null)
{
    try
    {
        const response = await puter.ai.chat(message);
        return response.message.content;
    }
    catch (error)
    {
        console.error("Ошибка в модели!", error);
        return null;
    }
}


var assistant_caption_text;
function assistant_caption()
{
    const body = document.querySelector("body");
    const app = document.getElementById("app");
    const selectionBox = document.getElementById("selection-box");
    let isSelecting = false;
    let startX, startY, endX, endY;
    let isCPressed = false;

    document.addEventListener('keydown', (e) => {
        if (e.key === 'c' || e.key === 'C' || e.key === 'с' || e.key === 'С') {
            isCPressed = true;

            app.style.zIndex = "-999";
        }
    });

    document.addEventListener('keyup', (e) => {
        if (e.key === 'c' || e.key === 'C' || e.key === 'с' || e.key === 'С') {
            isCPressed = false;

            app.style.zIndex = "0";
        }
    });

    body.addEventListener('mousedown', (e) => {
        if (isCPressed && e.button === 0)
        {
            isSelecting = true;
            startX = e.offsetX;
            startY = e.offsetY;

            selectionBox.style.left = `${startX}px`;
            selectionBox.style.top = `${startY}px`;
            selectionBox.style.width = '0px';
            selectionBox.style.height = '0px';
            selectionBox.style.display = 'block';
        }
    });

    body.addEventListener('mousemove', (e) => {
        if (isSelecting)
        {
            endX = e.offsetX;
            endY = e.offsetY;

            selectionBox.style.width = `${Math.abs(endX - startX)}px`;
            selectionBox.style.height = `${Math.abs(endY - startY)}px`;
            selectionBox.style.left = `${Math.min(startX, endX)}px`;
            selectionBox.style.top = `${Math.min(startY, endY)}px`;
        }
    });

    body.addEventListener('mouseup', () => {
        if (isSelecting) {
            isSelecting = false;
            selectionBox.style.display = 'none';

            const selectedArea = {
                left: Math.min(startX, endX),
                top: Math.min(startY, endY),
                width: Math.abs(endX - startX),
                height: Math.abs(endY - startY)
            };

            if (selectedArea.width > 0 && selectedArea.height > 0)
            {
                html2canvas(body, {
                    x: selectedArea.left,
                    y: selectedArea.top,
                    width: selectedArea.width,
                    height: selectedArea.height
                }).then(canvas => {
                    const dataUrl = canvas.toDataURL('image/png');

                    Tesseract.recognize(
                        dataUrl,
                        "rus",
                        { logger: info => console.log(info) }
                    ).then(({ data: { text } }) => {
                        console.log('Распознанный текст:', text);
                        alert(`Текст передан ассистенту: ${text}`);

                        assistant_caption_text = text;
                    }).catch(err => alert("Ассистент работает только с текстом!"));
                }).catch(err => console.error(err));
            } else {
                console.log('Выделенная область пустая.');
            }
        }
    });

    body.addEventListener('mouseleave', () => {
        if (isSelecting)
        {
            isSelecting = false;
            selectionBox.style.display = 'none';
        }
    });
}



addEventListener("DOMContentLoaded", assistant_caption);