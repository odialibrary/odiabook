<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Redirecting...</title>

<script>
setTimeout(function(){
    window.location.href = "https://example.com";
}, 3000); // 3000 = 3 seconds
</script>

<style>
body{
    font-family: Arial, sans-serif;
    background:#f4f6f9;
    display:flex;
    justify-content:center;
    align-items:center;
    height:100vh;
}
.box{
    text-align:center;
}
</style>

</head>

<body>

<div class="box">
<h2>Redirecting...</h2>
<p>You will be redirected in 3 seconds.</p>
<p>If not redirected, <a href="https://example.com">click here</a>.</p>
</div>

</body>
</html>
