const ValidUrlconverter = (name) => {
    const url = name.toString()
        .replaceAll(" ", "-")
        .replaceAll("'", "")
        .replaceAll("&", "-")
        .replaceAll("/", "-")
        .replaceAll("\\", "-")
        .replaceAll("?", "")
        .replaceAll("#", "")
        .replaceAll("%", "")
        .replaceAll("+", "-")
        .toLowerCase();
    return url;
}
export default ValidUrlconverter;