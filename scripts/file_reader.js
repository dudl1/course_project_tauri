let isFileAnylogic = false;

function func_file_anylogic()
{
    let windowAnylogic = document.querySelector(".window_anylogic");
    windowAnylogic.classList.add("active");

    let iframe = document.getElementById("anylogic-frame");
    iframe.src = "https://cloud.anylogic.com/models";

    document.querySelector(".window_anylogic").classList.add("active");
    if (!document.querySelector(".not_work").classList.contains("active"))
        document.querySelector(".not_work").classList.add("active");
}


let isFileExcel = false;

function func_file_excel(file_excel)
{
    if (!file_excel) return;

    file_excel.click();

    if (!isFileExcel)
    {
        file_excel.addEventListener('change', function(event)
        {
            const file = event.target.files[0];
            
            if (file)
            {
                var reader = new FileReader();
                reader.onload = function(e)
                {
                    var data = new Uint8Array(e.target.result);
                    var workbook = XLSX.read(data, { type: "array" });
                    
                    var worksheet = workbook.Sheets[workbook.SheetNames[0]];
                    var jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
            
                    function parseExcelData(rawData)
                    {
                        if (rawData.length < 2)
                        {
                            console.error("Недостаточно данных для обработки.");
                            return [];
                        }
                    
                        var headers = rawData[0];
                        var dataRows = rawData.slice(1);
                    
                        function createObjectFromRow(row, index)
                        {
                            var obj = { id: index + 1 };
                            headers.forEach((header, idx) => {
                                obj[header.toLowerCase().replace(/[^a-z0-9]/gi, '_')] = row[idx] || '';
                            });
                            return obj;
                        }
                    
                        var tabledata = dataRows
                            .filter(row => row.some(cell => cell))
                            .map((row, index) => createObjectFromRow(row, index));
                    
                        return tabledata;
                    }
            
                    var tabledata = parseExcelData(jsonData);
            
                    new Tabulator("#excel_content", {
                        data: tabledata,
                        autoColumns: true,
                    });
                };
                reader.readAsArrayBuffer(file);
            
                document.querySelector(".window_excel").classList.add("active");
                if (!document.querySelector(".not_work").classList.contains("active")) {
                    document.querySelector(".not_work").classList.add("active");
                }
            
                var observer = new MutationObserver(function(mutationsList, observer)
                {
                    const tabulars = document.querySelectorAll(".tabulator-cell");
                    if (tabulars.length > 0)
                    {
                        for (let i = 0; i < tabulars.length; i++)
                        {
                            const element = tabulars[i];
                            element.setAttribute("contenteditable", "true");
                        }
                        observer.disconnect();
                    }
                });
            
                observer.observe(document.querySelector("#excel_content"), { childList: true, subtree: true });
            }
            
        });

        isFileExcel = true;
    }
}