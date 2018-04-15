function leadingZeros(n, digits) {
    let zero = '';
    n = n.toString();

    if (n.length < digits) {
        for (let i = 0; i < digits - n.length; i++)
        zero += '0';
    }
    return zero + n;
}

function setPagination(count, current) {
    $(".pagination li").remove();
    $(".pagination").append('<li><a href="#plList" aria-label="Previous"><span class="bold" aria-hidden="true">&#xE000;</span></a></li>')
    for (i = 1; i <= count; i++) {
        if (i == current) {
            $(".pagination").append('<li class="active"><a href="#plList">' + leadingZeros(i, 2) + '</a></li>');
        }
        else {
            $(".pagination").append('<li><a href="#plList"  onClick="changePage(' + i + ')">' + leadingZeros(i, 2) + '</a></li>');
        }
    }
    $(".pagination").append('<li><a href="#plList" aria-label="Next"><span class="bold" aria-hidden="true">&#xE001;</span></a></li>')
}
