"use strict";

const puppeteer = require("puppeteer");
const cheerio = require("cheerio");
const fs = require("fs");

const AREAS = ["CW"];

    (async() => {

        let dataTable = [];

        const browser = await puppeteer.launch();
        const page = await
        browser.newPage();
        page.setViewport({
            width: 1349,
            height: 768
        });


        // get subpage codes
        await page.goto("https://www.citypopulation.de/php/ireland.php");
        let html = await page.content();
        let $ = cheerio.load(html);

        $("#adminareas tr ").each(function(i, elem) {
            const PREFIX = "javascript:symArea('";
            let onclickText = "" + elem.attribs.onclick;
            let adminarea = onclickText.substring(PREFIX.length, PREFIX.length+2);
            if (adminarea.length>0) {
                console.log(">" + adminarea);
                AREAS.push(adminarea);  
            }
        });

        for (let q = 0; q < AREAS.length; q++) {

            let A = AREAS[q];

            await page.goto("https://www.citypopulation.de/php/ireland.php?adm2id=" + A);
            html = await page.content();
            $ = cheerio.load(html);
           
            $("#ts tbody tr").each(function(i, elemi) {
                //console.log("x");
                let row = new Object();
                row.area = A;
                let nameTd = $(this).find("td[class='rname']");
                row.name = nameTd.text();
                row.status = $(this).find("td[class='rstatus']").text();
                row.county = $(this).find("td[class='radm rarea']").text();
                row.population1991_04_21 = $(this).find("td[class='rpop prio6']").text();
                row.population1996_04_28 = $(this).find("td[class='rpop prio5']").text();
                row.population2002_04_28 = $(this).find("td[class='rpop prio4']").text();
                row.population2006_04_23 = $(this).find("td[class='rpop prio3']").text();
                row.population2011_04_10 = $(this).find("td[class='rpop prio2']").text();
                row.population2016_04_24 = $(this).find("td[class='rpop prio1']").text();
                row.area = nameTd.attr("data-area");
                row.density = nameTd.attr("data-density");

                dataTable.push(row);
            });

            console.log(A + ":" + dataTable.length);

        }
        
        browser.close();

        let jsonString = JSON.stringify(dataTable);
        //console.log(jsonString);
        let data = JSON.parse(jsonString);
        let body = "area,density,name,status,county,population1991_04_21,population1996_04_28,population2002_04_28,population2006_04_23,population2011_04_10,population2016_04_24\n";
        for(let i = 0; i < data.length; i++) {
            let line = "";
            line = line + '"' + data[i].area + '","' + data[i].density + '","' + data[i].name + '","' + data[i].status + '","' + data[i].county + '","' + data[i].population1991_04_21 + '","' + data[i].population1996_04_28 + '","' + data[i].population2002_04_28 + '","' + data[i].population2006_04_23 + '","' + data[i].population2011_04_10 + '","' + data[i].population2016_04_24 + '"';
            body = body + "\n" + line;
        }
        fs.writeFileSync("citypopulation_de-" + A + ".csv", body);
        
        console.log("\n\nScrape Complete. ");
    })();
