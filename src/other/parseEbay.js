const axios = require('axios')
const cheerio = require('cheerio')

function axiosReq(url) {
    return axios.get(url, {
        timeout: 5000,
        headers: {
            'cache-control': 'max-age=0',
            'referer': 'https://google.com',
            'upgrade-insecure-requests': '1',
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.87 Safari/537.36',
            'cookie': 'reese84=3:5drA0Fi2j+4+As7kZocdWw==:c/VcPDWhO17cI0I1zDTJpoZl5w3zC3GQVUEbmC2WHgwzfot1W9F2VroHOMqq2xuAi5P0gsMj6VTM8vGTNw/ij/XJL3JqfGOmvuzQylJxdTwqMlK9vdV7fGjiOAQieH1sVgsLGEsUlvwYlUdsfjY7ewLkMgvrSC9GSUX9AJSpFb1Cz2ZLnpvg87x1fhlJSDeuyZ9B3pHdbIGCy8WmP+1VUqKF1LYr0DS4mYAe8PMU3BOi3GRGpwPVxaC1LO8JPpP8on+JR2I96RAGB2QyudC4jHOfomY/VLg9hXw9SR9fgDlMXGYEJ+LgLXsqQzRkXFKZPqDFbmY/NRIUwdULNVqF2gHKHlSodlR/ODJ07rHPoCr6ZRFtTYa24IxjICystpgIAvrw8ejvzLiVzdCOlsezJj3bx4OdvE5PF4sIrKd+hBT+Zg/HQUuOkzNHms8NK+M9LJrQFaDjmzyAtZoUf8azvpcFTutPa3h02BbsMEDUjn4RyyZ5i08beI4LGIwstuXp:Uo7y+aEf2w0LsxU2gs4EiQWvOqrPhKoQrgaKqpeIXjs=; euconsent-v2=CPUzwIBPUzwIBCBAqAESCDCoAP_AAP_AAAiQIltf_X__bX9n-_7___t0eY1f9_r3v-QzjhfNt-8F3L_W_L0X_2E7NF36pq4KuR4ku3bBIQNtHMnUTUmxaolVrzHsak2cpyNKJ7LkmnsZe2dYGHtPn9lD-YKZ7_7___f73z___9_-39z3_9f___d__-__-vjf_59__________________________4Iltf_X__bX9n-_7___t0eY1f9_r3v-QzjhfNt-8F3L_W_L0X_2E7NF36pq4KuR4ku3bBIQNtHMnUTUmxaolVrzHsak2cpyNKJ7LkmnsZe2dYGHtPn9lD-YKZ7_7___f73z___9_-39z3_9f___d__-__-vjf_59__________________________4AAA; borosTcf=eyJwb2xpY3lWZXJzaW9uIjoyLCJjbXBWZXJzaW9uIjo0MiwicHVycG9zZSI6eyJjb25zZW50cyI6eyIxIjp0cnVlLCIyIjp0cnVlLCIzIjp0cnVlLCI0Ijp0cnVlLCI1Ijp0cnVlLCI2Ijp0cnVlLCI3Ijp0cnVlLCI4Ijp0cnVlLCI5Ijp0cnVlLCIxMCI6dHJ1ZX19LCJzcGVjaWFsRmVhdHVyZXMiOnsiMSI6dHJ1ZX0sInZlbmRvciI6eyJjb25zZW50cyI6eyI1NjUiOnRydWV9fX0=; AMCV_05FF6243578784B37F000101%40AdobeOrg=-408604571%7CMCIDTS%7C19046%7CvVersion%7C4.6.0; PHPSESSID=8sdfpv1p6qkurnncbmhp94kt7s'
        }
    }).then(response => response.data)
}

async function parser(url, service) {
    try {
        let tmpres = []

        let data = await axiosReq(url)
        const $ = await cheerio.load(data)

        let name = $('#viewad-title').text()
        let price = parseInt($('#viewad-price').text())
        let image = $('#viewad-image').attr()['src']

        tmpres.push(name, price, image)

        return await tmpres
    } catch (e) {
        console.log(`problems with parser => ${e}`)
    }
}

module.exports = parser