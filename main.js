async function loadTemplate(filePath)
{
    try
    {
        const response = await fetch(filePath);
        if (!response.ok) throw new Error('Ошибка загрузки шаблона');

        const templateText = await response.text();
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = templateText;

        const externalTemplate = tempDiv.querySelector('template');
        if (externalTemplate)
        {
            return externalTemplate.content.cloneNode(true);
        }
        else
        {
            throw new Error('Шаблон не найден');
        }
    }
    catch (error)
    {
        console.error('Ошибка загрузки шаблона:', error);
        return null;
    }
}

async function loadCSS()
{
    try
    {
        const response = await fetch('/style.css');
        if (!response.ok) throw new Error('Ошибка загрузки CSS');

        const cssText = await response.text();
        const style = document.createElement('style');
        style.textContent = cssText;
        document.head.appendChild(style);
    }
    catch (error)
    {
        console.error('Ошибка загрузки CSS:', error);
    }
}


const templates = [
    "./components/window_menu.html",
    "./components/work.html",
    "./components/panel_assistant.html"
];

async function loadExternalTemplates()
{
    await loadCSS();

    const contentDiv = document.getElementById('app');
    for (const template of templates)
    {
        const templateContent = await loadTemplate(template);
        if (templateContent)
        {
            contentDiv.appendChild(templateContent);
        }
    }

    const scripts = contentDiv.querySelectorAll('script');
    scripts.forEach(
        script =>
        {
            const scriptText = script.innerHTML.trim();
            if (scriptText)
            {
                const fn = new Function('document', scriptText);
                fn(document);
            }
        }
    );
}
loadExternalTemplates();