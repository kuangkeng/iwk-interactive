<?php
     $result_share = $_GET['result_share'];
?>

<!DOCTYPE html>
<head>
     <!-- This url should be the same as the href you passed in to showDialog -->
     <meta property="og:url" content="<?="https://interactive.pri.org".$_SERVER['REQUEST_URI'];?>" /> 
     <meta property="og:title" content="<?=$result_share?>"/>
     <meta property="og:description" content="Take this quiz to test how well you know the water you use every day."/> 
     <meta property="og:image" content=""/>
     <meta property="fb:app_id" content="">
     <meta property="og:locale" content="en_US" />
     <meta property="og:type" content="article">
     <meta property="og:site_name" content="Malaysiakini" />
     <meta property="article:publisher" content="https://www.facebook.com/publicradiointernational" />

	 
</head>

<!-- both url is the url where your story page is hosted -->
<?php
include('https://interactive.pri.org/2017/fair-fashion-quiz/');
?>
<script>window.location.href = 'https://interactive.pri.org/2017/fair-fashion-quiz/';</script>