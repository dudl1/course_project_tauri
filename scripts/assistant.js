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