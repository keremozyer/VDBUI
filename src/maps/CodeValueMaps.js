const reportStatusMap = [
    { value: "CMP", label: "Tamamlandı" },
    { value: "PROC", label: "İşlem Sürüyor" },
    { value: "WAIT", label: "Beklemede" },
    { value: "ERR", label: "Hata Yaşandı" },
];

const cveMatchTypeMap = {
    3: "Zafiyet Versiyon Aralığında Nümerik Olmayan Karakter Olduğu İçin Versiyon Kıyaslaması Yapılmamıştır.",
    4: "Zafiyet Versiyonu Bildirilmediği İçin Versiyon Kıyaslaması Yapılmamıştır.",
    5: "Ürün Versiyonu Bildirilmediği İçin Versiyon Kıyaslaması Yapılmamıştır."
};

export default {
    reportStatusMap: reportStatusMap,
    cveMatchTypeMap: cveMatchTypeMap
}