const axios = require("axios");
const cheerio = require("cheerio");
const ObjectsToCsv = require("objects-to-csv");

linkedinJobs = [];

let keywords = "internship",
  geoId = "102257491";
for (let pageNumber = 0; pageNumber < 1000; pageNumber += 25) {
  let url = `https://www.linkedin.com/jobs-guest/jobs/api/seeMoreJobPostings/search`;

  axios(url, { params: { keywords, geoId, start: pageNumber } })
    .then((response) => {
      const html = response.data;
      const $ = cheerio.load(html);
      const jobs = $("li");
      jobs.each((index, element) => {
        const jobTitle = $(element).find("h3.base-search-card__title").text().trim();
        const company = $(element).find("h4.base-search-card__subtitle").text().trim();
        const location = $(element).find("span.job-search-card__location").text().trim();
        const link = $(element).find("a.base-card__full-link").attr("href");
        linkedinJobs.push({
          Title: jobTitle,
          Company: company,
          Location: location,
          Link: link,
        });
      });
      const csv = new ObjectsToCsv(linkedinJobs);
      csv.toDisk(`./linkedInJobs(${keywords}).csv`, { append: true });
    })

    .catch(console.error);
}
