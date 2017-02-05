define(function () {
    return {
        getMonument: function () {
            $.ajax({
                dataType: "json",
                url: url,
                data: data,
                success: success
            });
            return 'Hello World';
        }
    };
});