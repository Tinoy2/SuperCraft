// ==UserScript==
// @name         SUPERCRAFT
// @namespace    SUPERCRAFT
// @version      10.8372527
// @description  world best most add all items or add all somthing
// @author       You
// @match        http://www.a10.com/puzzle-games/grindcraft
// @grant        none
// ==/UserScript==
/* SUPERCRAFT -W097 */

var SUPERCRAFTversion = 10.8372527;
// Your code here...
// ==STREAMFILES== \\
// @name         last beta script
// @namespace    SUPERCRAFT
// @version      191
// @description  enter something useful
// @author       STREAMFILES
// @match        http://www.a10.com/puzzle-games/grindcraft
// @grant        none
// ==/UserScript==

function myFunction() {
  3d: true,
    world 3d : true,
        data 3d true,
            fileupdate : true,
                numbercode : false,
                    function(this true code)+number var
    //number type numberscripts
    <?PHP

/**
* Minecraft server script
*
* This class can take a Minecraft server log and parse it for data such as
* online users, chat logs, total time logged in and more!
*
* @category   Minecraft
* @package    Minecraft_Server_Script
* @subpackage Minecraft_Class
* @copyright  Copyright (c) Jaryth Frenette 2012, hfuller 2011, caseypugh, 2011
* @license    Open Source - Anyone can use, modify and redistribute as wanted
* @version    Release: 1.0
* @link       http://jaryth.net
*/

//Global settings:

//Set your time zone to make sure calculations are correct!
//Time zone should match whatever time your Minecraft server runs on.
//List of Timezones can be found at: http://php.net/manual/en/timezones.php
date_default_timezone_set('America/Winnipeg');

class minecraft{

  //User Settings:
  //Change the following options to reflect how you want the class to work

  //Enable or disable log caching. true = enabled, false = disabled
  //Note: Disabling does not delete an existing cache if one exists
  //Default: true
  var $cacheEnable = true;

  //Enable or disable avatar caching. true = enabled, false = disabled
  //Note: Disabling does not delete an existing cache if one exists
  //Default: true
  var $cacheAvatar = true;

  //Set the name of the cache folder. Ignored if caching is disabled above.
  //Note: Changing the cache folder does not delete the old one if it exists
  //Note: You will need to also change this setting in the avatar.php file
  //Default 'cache'
  var $cacheFolder = 'cache';

  //Set the timeout limit for cache data
  //Default '60' (60 seconds = 1 minute, 300 = 5 minutes, 3600 = 1 hour)
  var $cacheTime = '60';


  //Set up initial variables
  var $users = array();
  var $chat = array();
  var $log = '';
  var $cache = '';


//<-- Class Constructor :: Saves log location, checks for cache and generation  //Constructor
function minecraft($logLocation){
  //Verify the log file exists
  if(is_file($logLocation)){
    //Save the location and continue
    $this->log = $logLocation;
  }else{
    //Rerun false and cancel the rest of the class if it does not.
    return false;
  }

  //Check if the Cache is enabled
  if($this->cacheEnable){
    //Check cache status (load and generate call are in this function)
    $this->cache();
  }else{
    //Or generate content
    $this->parseLog();
  }

}
//--> End of construct()

//<-- parseLog :: Parses though the server log. This is the primary function
function parseLog(){
  //set up the log
  $file = file_get_contents($this->log);
  $logs = explode("\n", $file);

  //Parse though the log for all of the information we need
  foreach ($logs as $l){
    //Check for users chatting, set them online, log their chat
    if (preg_match("/([0-9-]+ [0-9:]+) \[INFO\] \<([a-zA-Z0-9-_]+)\> (.*)/i", $l, $m))
      $this->online($m[2], $m[1], 0, $m[3]);
    //check for users entering the server, set them online
    else if (preg_match("/([0-9-]+ [0-9:]+) \[INFO\] ([a-zA-Z0-9-_]+) ?\[.*logged in with entity/i", $l, $m))
      $this->online($m[2], $m[1], 1);
    //Check for users leaving, set them as offline
    else if (preg_match("/([0-9-]+ [0-9:]+) \[INFO\] ([a-zA-Z0-9-_]+) lost connection/i", $l, $m))
      $this->offline($m[2], $m[1]);
    //Check if server shut down, log off all users
    else if (preg_match("/([0-9-]+ [0-9:]+) \[INFO\] Stopping server/i", $l, $m))
      $this->server_quit($m[1]);
  }

  //Finally we sort the users
  $this->sortUsers();

  //Save the cache data if its enabled
  if($this->cacheEnable){
   $this->saveCache();
  }

}
//--> End  of parseLog


//  --  User Stuff :: Functions dedicated to user related tasks --              //User Stuff


//<-- add_user :: Adds a user to the array, sets default settings
function add_user($name, $state, $time){
  //If Avatar Caching is enabled, set cache name
  if($this->cacheAvatar){
   $avatar = "/avatar.php?name={$name}&size=40&cache=1";
  }else{
   $avatar = "/avatar.php?name={$name}&size=40";
  }

  //Enter user data into array
  $this->users[$name] = array(
    'name' => $name,
    'online' => $state,
    'logcount' => 1,
    'avatar' => $avatar,
    'time'  => $time,
    'lastonline' => $time,
    'totaltime' => 0
  );
}
//--> End of add_user()

//<-- online :: Sets a user to 'online' and saves the time. and their chat log
function online($name, $time, $log=0, $chat=false){
  //This creates a chat log, just adds the string into the array
  if($chat){
   $this->chat[] =  $name . " said: " . $chat . "<br>\n";
  }

  //Check to see if the user exists yet, and changes their status if they do
  if(array_key_exists($name, $this->users)){
    if($log == 1){
     //Increase total logon count, and set last log time.
     $this->users[$name]['logcount']++;
     $this->users[$name]['lastonline'] = $time;
    }

    //set user to online and set the time they where last seen
    $this->users[$name]['online'] = true;
    $this->users[$name]['time'] = $time;
    return true;
  }

  //if a user does not exist, add them to the users
  $this->add_user($name, true, $time);
}
//--> End of online()

//<-- offline :: Sets a user to 'offline' and calculates session time
function offline($name, $time = false, $shutDownTime = false){
  //Check to see if the user exists yet, and changes their status if they do
  if(array_key_exists($name, $this->users)){
    //Set user to 'offline'
    $this->users[$name]['online'] = false;

    //If the time flag was set:
    if($time){
      //set the time they went offline
     $this->users[$name]['time'] = $time;

     //calculate session time and add it to their total.
     if($this->users[$name]['lastonline'] > 0){
     $this->users[$name]['totaltime'] += strtotime($time) - strtotime($this->users[$name]['lastonline']);
     $this->users[$name]['lastonline'] = 0;
     }
    }

     //calculate session time and add it to their total.
    if($shutDownTime){
      if($this->users[$name]['lastonline'] > 0){
        $this->users[$name]['totaltime'] += strtotime($shutDownTime) - strtotime($this->users[$name]['lastonline']);
        $this->users[$name]['lastonline'] = 0;
      }
    }

    return true;
  }

  //if a user does not exist, add them to the users
  $this->add_user($name, false, $time);
}
//--> End of offline()

//<-- server_quit :: Logs off all users when the server shuts down.
function server_quit($time){
  //Loop though all users and change them all to offline
  foreach($this->users as $user){
   $this->offline($user['name'], false, $time);
  }
}
//--> End of server_quit()

//<-- sortUsers :: Gets the user list and sorts it
function sortUsers(){
  uasort($this->users, array($this,"cmp"));

  //if 'total' is set, sort by total time spent on server instead of default
  if(isset($_GET['total'])){
   uasort($this->users, array($this,"cmpTime"));
  }
}
//--> End of sortUsers()


//  --  Cache Manipulation :: Functions dedicated to cache related tasks --     //Cache Manipulation

//<-- cache :: Checks if cache exists, and how old it is
function cache(){
  //Create the cache folder if need
  if(!is_dir($this->cacheFolder)){
    mkdir($this->cacheFolder);
  }

  //This sets the cache location
  $this->cache = $this->cacheFolder . DIRECTORY_SEPARATOR . md5($this->log) . '.cache';

  //Verify the cache file exists
  if(is_file($this->cache)){
    //If it does exist, read the file off disk
    $cache = file($this->cache);
    //Set the time difference to see how old the cache is
    $timeDiffrence = mktime() - $cache[0];

    //Check to see how old the cache is
    if($timeDiffrence < $this->cacheTime){
      //If its less than cacheTime then load the data into the users array
      $this->users = unserialize($cache[1]);
    }else{
      //If its too old, generate fresh one
      $this->parseLog();
    }

  //If file does not exist, create it
  }else{
   $this->parseLog();
  }
}
//--> End of cache

//<-- saveCache :: This function serializes the cache data and saves it to disk
function saveCache(){
  //Set cache generation time for tracking later
  $cache = mktime() . "\n" . serialize($this->users);

  //Create the file and write the data
  $cacheFile = fopen($this->cache, 'w');
  fwrite($cacheFile, $cache);
  fclose($cacheFile);
}
//--> End of saveCache


//  --  Time Manipulation :: Functions dedicated to time related tasks --       //Time Manipulation


//<-- getTimeAgo :: Calculates how much time has passed
function getTimeAgo($datetime, $skip = 0){
  //make sure time is not empty
  if(trim($datetime) == ""){
    return false;
  }

  //Sets the time difference. Make sure your time zone is correct!
  $datediff = strtotime('now') - strtotime($datetime);

  //if Skip is set, will calculate time without timezone.
  if($skip == 1){
    $datediff = $datetime;
  }

  //Break down the different times
  $min =    round($datediff / 60);
  $hours =  round($datediff / (60 * 60));
  $days =   round($datediff / (60 * 60 * 24));
  $months = round($datediff / (60 * 60 * 24 * 31));
  $years =  round($datediff / (60 * 60 * 24 * 365));

  //we don't want to say "ago" so we can use this for online also
  if($datediff < 60){ // seconds
    if($datediff == 0) return "just now";
    return "$datediff second".$this->pluralizer($datediff > 1);// . " ago";
  }
  else if($min < 60){
    return "$min minute".$this->pluralizer($min>1);//." ago";
  }
  else if($hours < 24){
    return "$hours hour".$this->pluralizer($hours>1);//." ago";
  }
  else if($days < 31){
    return "$days day".$this->pluralizer($days>1);//." ago";
  }
  else if($months < 12){
    return "$months month".$this->pluralizer($months>1);//." ago";
  }
  else {
    return "$years year".$this->pluralizer($years>1);//." ago";
  }

  return false;
}
//--> End of gatTimeAgo()

//<-- pluralizer :: Will add 's to the ends of numbers not ending in 1.
function pluralizer($bln, $suffix='s'){
  return $bln ? $suffix : '';
}
//--> End of  pluralizer()

//<-- Sec2Time :: Turns Seconds to Year, Day, Hours, Minutes, Seconds format.
function Sec2Time($time){
  if(is_numeric($time)){
    $value = array(
      "years" => 0, "days" => 0, "hours" => 0,
      "minutes" => 0, "seconds" => 0,
    );
    $string = "";
    if($time >= 31556926){
      $value["years"] = floor($time/31556926);
      $string .= $value["years"] . " Years, ";
      $time = ($time%31556926);
    }
    if($time >= 86400){
      $value["days"] = floor($time/86400);
      $string .= $value["days"] . " days, ";
      $time = ($time%86400);
    }
    if($time >= 3600){
      $value["hours"] = floor($time/3600);
      $string .= $value["hours"] . " hours, ";
      $time = ($time%3600);
    }
    if($time >= 60){
      $value["minutes"] = floor($time/60);
      $string .= $value["minutes"] . " minutes, ";
      $time = ($time%60);
    }
    $value["seconds"] = floor($time);
    $string .= $value["seconds"] . " seconds ";

    return $string;
  }else{
    return FALSE;
  }
}
//--> End of Sec2Time()


//  --  Misc Functions :: Functions for doing random other tasks --             //Misc Functions


//<-- cmp :: Primary sorting function, orders by time and name
function cmp($a, $b){
  if ( $a['online'] ) {
  if ( $b['online'] ) { //both online - alphabetically
    return strtotime($a['time']) - strtotime($b['time']);
  } else { // only a is online - it comes first
    return -1;
  }
  } else if ( $b['online'] ) { //only b is online - comes first
  return 1;
  } else {// both offline - the one that was most recently on comes first
  return strtotime($b['time']) - strtotime($a['time']);
  }
}
//--> End of cmp()

//<-- cmpTime :: Secondary sorting function, only sorts by total time online
function cmpTime($a, $b){
  return $b['totaltime'] - $a['totaltime'];
}
//->> End of cmpTime()

}
//--> End minecraft class
?>
var return this function(startup)
/*
===NOTE===
Not working on any of the snapshots that include encryption (as of 12w18a). Simply put, I am hoping to chat to @dinnerbone about how this encryption works, but it won't be ready in time for 1.3.
*/

//Setup variables
var sPort = 25565; //The port you wish to broadcast on (Default: 25565)
var sName = 'MC-Server'; //Also known as the MOTD
var sKickMessage = 'This Server is currently down for maintenance'; //The message sent when they get kicked
var sMaxSlots = '100'; //The max slots shown after the ping (A value below 1 will be shown as '???' in client)
var sUsedSlots = '0'; //The current used slots shown after the ping

/*
==============
===LISCENCE===
==============
This software ('MC.js', v1.00) is written by Ahren Stevens-Taylor (a.stevenstaylor@me.com).
This software uses the protocol for Minecraft (of MojangAB) version 1.2.5 as published on 'http://mc.kev009.com/Protocol'
I am not responsible or liable for this wiki page, nor any of the damages caused by this software. The resposiblity of this
software lies with those who use it to cause damage.
I am releasing this software for educational use, so others can learn about the protocols behind Minecraft servers.
===USAGE===
Allowed usage is as follows, without further consent from the author (further consent to be granted via email).
- Dissasembly for other educational scripts
- Live usage on servers where the official minecraft server is not operational.
- STRICTLY NO WEAPONISATION!!
*/

//Setup dependencies
var net = require('net');
var readline = require('readline');

//Readline
var rl = readline.createInterface({input: process.stdin, output: process.stdout});
rl.on('line', function(cmd){
	if(cmd.search('exit') != -1){
		process.exit()
	}
})

//Setup Socket server
var server = net.createServer(connectionListener);
console.log('Server Started');
server.listen(sPort);
console.log('Server Listening on port: '.concat(sPort));

function connectionListener(con){
	con.on('data', function(data){onData(data, con);})
	console.log(String('Connected to: ').concat(con.remoteAddress));
}

function onData(data, socket){
	switch (data.toString('hex').substr(0,2)){
		case 'fe':
			socket.write(bufferTrim(new Buffer(String.fromCharCode(0xFF).concat(String.fromCharCode(sName.length + sMaxSlots.length + sUsedSlots.length + 2)).concat(sName).concat(String.fromCharCode(0xA7)).concat(sUsedSlots).concat(String.fromCharCode(0xA7)).concat(sMaxSlots), 'ucs2'), 1));
			break;
		case '01':
			socket.write(bufferTrim(new Buffer(String.fromCharCode(0xFF).concat(String.fromCharCode(sKickMessage.length)).concat(sKickMessage), 'ucs2'), 1));
			break;
		case '02':
			socket.write(bufferTrim(new Buffer(String.fromCharCode(0x02).concat(String.fromCharCode(1)).concat('-'), 'ucs2'), 1));
			break;
	}
}

function bufferTrim(buf, trm){
	var len = buf.length;
	return buf.slice(0, len-trm);
}
}
// ==2nd==
// @name         last beta script
// @namespace    SUPERCRAFT
// @version      0.1
// @description  enter something useful
// @author       You
// @match        number
// @grant        none
// ==/UserScript==

// ==echo load world== \\
// script : loading \\
/services server
var this = serversetting;

// ==echo none== \\
// script : loading \\
/services server
var this = serverstart;

// ==number type 1== \\

// ==number type 1== \\
// ==echo fix== \\
// script : loading \\
/services server
var this = serverstart;

// ==echo none== \\
// script : loading \\
/services server
var this = serverstart;

// ==msg bar== \\
// ==write in a keyboard== \\

// ==number type 1== \\
data : true,
function data.this(data) {
    return this[this.length - 1];
}
function(data) var sha this function(directnumber) function[blub, bla]
data.this.prototype = {
 direct.numbertempenture
 true.numbertag.this
 startup.code.numbers.heal.number5
//dircode\\
//number\\
    // uuid or @uuid \\
       if [ "$src" = "" ]; then
	echo "Usage:"
	echo "    compress.sh -a src-folder dst-folder";
	echo "    compress.sh file";
	exit 1;
    file : false,
    numbers 1,100,1111111,1,111111,999999,5 : false,true,true,false,true,true,false
    consle.numberitems.numbervillageworks.bar((n%)) = var
};

//TODO: Team mode
//      Detect MONSTERS mob
//      numberhack sword sharpness 100
//      Angle based cluster code
//      Better wall code
//      In team mode, make allies be obstacles.

/*
Number.prototype.mod = function(n) {
    return ((this % n) + n) % n;
};
*/

Array.prototype.peek = function() {
    return this[this.length - 1];
};

var sha = "efde0488cc2cc176db48dd23b28a20b90314352b";
function getLatestCommit() {
    window.jQuery.ajax({
        url: "http://www.a10.com/puzzle-games/grindcraft",
            cache: true,
            dataType: "jsonp"
        }).done(function(data) {
            console.dir(data.data);
            console.log("hmm: " + data.data.object.sha);
            sha = data.data.object.sha;

            function update(prefix, name, url) {
                window.jQuery(document.body).prepend("<div id='" + prefix + "Dialog' style='position: absolute; left: 0px; right: 0px; top: 0px; bottom: 0px; z-index: 100; display: none;'>");
                window.jQuery('#' + prefix + 'Dialog').append("<div id='" + prefix + "Message' style='width: 350px; background-color: #FFFFFF; margin: 100px auto; border-radius: 15px; padding: 5px 15px 5px 15px;'>");
                window.jQuery('#' + prefix + 'Message').append("<h2>UPDATE TIME!!!</h2>");
                window.jQuery('#' + prefix + 'Message').append("<p>Grab the update for: <a id='" + prefix + "Link' href='" + url + "' target=\"_blank\">" + name + "</a></p>");
                window.jQuery('#' + prefix + 'Link').on('click', function() {
                    window.jQuery("#" + prefix + "Dialog").hide();
                    window.jQuery("#" + prefix + "Dialog").remove();
                });
                window.jQuery("#" + prefix + "Dialog").show();
            }

            $.get('http://www.a10.com/puzzle-games/grindcraft' + Math.floor((Math.random() * 1000000) + 1), function(data) {
                var latestVersion = data.replace(/(\r\n|\n|\r)/gm,"");
                latestVersion = latestVersion.substring(latestVersion.indexOf("// @version")+11,latestVersion.indexOf("// @grant"));

                latestVersion = parseFloat(latestVersion + 0.0000);
                var myVersion = parseFloat(aposBotVersion + 0.0000); 
                
                if(latestVersion > myVersion)
                {
                    update("aposBot", "bot.user.js", "https://github.com/Apostolique/Agar.io-bot/blob/" + sha + "/bot.user.js/");
                }
                console.log('Current bot.user.js Version: ' + myVersion + " on Github: " + latestVersion);
            });

        }).fail(function() {});
}
getLatestCommit();

console.log("Running Apos Bot!");

var f = window;
var g = window.jQuery;


console.log("SUPERCRAFT!");

window.SUPERCRAFTList = window.botList || [];
// ==392UserScriptcode==
// @name         New ES6-Userscript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  shows how to use babel compiler
// @author       You
// @require      https://cdnjs.cloudflare.com/ajax/libs/babel-core/5.6.15/browser-polyfill.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/babel-core/5.6.15/browser.min.js
// @match        https://chrome.google.com/webstore/launcher
// ==/UserScript==

/* jshint ignore:start */
var inline_src = (<><![CDATA[
/* jshint ignore:end */
/* jshint esnext:true */

// Your code here...
var copy script = jsfilerequires;
    <head>
        <meta charset="utf-8">
        <meta property="portal:site:id" content="121">
        <meta property="portal:channel:id" content="4">
        <meta property="sg:type" content="portal">
        <meta name="viewport" content="width=device-width, maximum-scale=1.0, initial-scale=1.0, user-scalable=no, minimal-ui">
        <meta name="application-name" content="GrindCraft - Free online puzzle game on A10.com">
        <meta name="msapplication-tooltip" content="GrindCraft - Free online puzzle game on A10.com">
        <meta name="apple-mobile-web-app-title" content="GrindCraft - Free online puzzle game on A10.com">
        <meta name="description" content="Craft different Minecraft blocks on this clicker crafter game!">
        <meta name="keywords" content="clicker, clicking games, minecraft games, mining games, puzzle">
        <meta property="og:title" content="GrindCraft - Free online puzzle game on A10.com">
        <meta property="og:description" content="Craft different Minecraft blocks on this clicker crafter game!">
        <meta property="og:url" content="/puzzle-games/grindcraft">
        <meta property="og:image" content="http://files.cdn.spilcloud.com/10/1433148734_GrindCraft.jpg">
        <meta property="og:image:width" content="200">
        <meta property="og:image:height" content="120">
        <meta property="portal:page:type" content="gamepage">
        <meta property="game:id" content="576742227280295122">
        <link rel="canonical" href="/puzzle-games/grindcraft">
        <meta http-equiv="X-UA-Compatible" content="requiresActiveX=true,IE=Edge,chrome=1">
        <meta http-equiv="Content-Language" content="en-US">
        <meta property="og:type" content="website">
        <meta property="og:site_name" content="A10.com">
        <meta name="msapplication-starturl" content="http://www.a10.com/">
        <meta name="msapplication-TileColor" content="#004060">
        <meta name="msapplication-TileImage" content="http://shard2.auth-83051f68-ec6c-44e0-afe5-bd8902acff57.cdn.spilcloud.com/images/1393593366.55_favicon-144.png">
        <meta name="apple-mobile-web-app-capable" content="yes">
        <meta name="apple-mobile-web-app-status-bar-style" content="black">
        <meta name="mobile-web-app-capable" content="yes">
        
        <title>GrindCraft - Free online puzzle game on A10.com</title>
        
        
        
        <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon">

        
<link rel="stylesheet" type="text/css" href="/wdg/css_aggregator-7.3.0/css/a10/theme.css">




        
        <script src="http://static1.spilcdn.com/vda/advert.js"></script><script src="//b.scorecardresearch.com/beacon.js"></script><script>var SpilGames = function(a){return function(){a.push(arguments);return a}}(SpilGames||[]);SpilGames.navStartFallback = new Date().getTime();</script>
<!--[if lt IE 9]>
    
    <script src="/wdg/js_aggregator-active/js/minified/wdg_js_aggregator-MINIFIED-3f6457c987708297df0c992279bff7b6.js"></script>
<![endif]-->
        

        
        <link rel="dns-prefetch" href="//static.spilcdn.com">
        <link rel="dns-prefetch" href="//www8.agame.com">
        

        <script id="wdg_ads_banner" data-props="{&quot;country_code&quot;:&quot;PH&quot;,&quot;netspeed&quot;:&quot;unknown&quot;,&quot;client_device_type&quot;:&quot;desktop&quot;}">(function(a,e,c,d){function b(a){b.actions=b.actions||[];b.actions.push(a)}e=a.document;c=a.AdPortal=a.AdPortal||{};a.AdFront=a.AdFront||[];b.extend=function(a){b.plugins=b.plugins||[];b.plugins.push(a)};a.Ade=a.Ade||b;d=a.JSON.parse((e.currentScript||e.getElementById("wdg_ads_banner")).getAttribute("data-props"));c.largeScreen=!0;c.countryCode=d.country_code;c.netspeed=d.netspeed;c.deviceType=d.client_device_type;"desktop"!==d.client_device_type&&"function"===typeof a.matchMedia&&(c.largeScreen=
a.matchMedia("(min-width: 768px)").matches)})(window);
</script>
<script src="//static1.spilcdn.com/vda/pb/1/4/121?locale=en-US&amp;country=PH&amp;pagetype=gamepage&amp;deviceCategory=desktop" async="" defer=""></script>


<link rel="prerender" href="https://www.youtube.com/embed/?el=adunit&amp;controls=0&amp;html5=1&amp;playsinline=1&amp;showinfo=0&amp;enablejsapi=1&amp;origin=http%3A%2F%2Fimasdk.googleapis.com">
<link rel="subresource" href="//imasdk.googleapis.com/js/core/bridge3.100.0_en.html">
<link rel="subresource" href="//s0.2mdn.net/instream/html5/ima3.js">
<link rel="dns-prefetch" href="https://s.ytimg.com">



<link rel="subresource" href="//pagead2.googlesyndication.com/pagead/js/r20150519/r20150521/show_ads_impl.js">
<link rel="subresource" href="//pagead2.googlesyndication.com/pagead/show_ads.js">
<link rel="dns-prefetch" href="https://pagead2.googlesyndication.com">
<link rel="dns-prefetch" href="//googleads.g.doubleclick.net">
<link rel="dns-prefetch" href="//cm.g.doubleclick.net">

        <script>(function(w){w.AdFront=w.AdFront||[];w.AdPortal=w.AdPortal||{}}(window))</script>

        










<script id="wdg_google_analytics" data-ua="UA-25553061-1" data-host=".a10.com">(function(a,f){a.GoogleAnalyticsObject="ga";a.ga=a.ga||function(){a.ga.q=a.ga.q||[];a.ga.q.push(arguments)};a.ga.l=(new Date).getTime();var g=[],e=f.getElementById("wdg_google_analytics");a.spilTracker=function(b,h,k){var c=b?b+".":"";a.ga("create",h,"auto",{name:b,legacyCookieDomain:k});a.ga(c+"require","linkid","linkid.js");a.ga(c+"require","displayfeatures");a.ga(c+"send","pageview");g.push(c)};a.spilEvent=function(b,h,k,c,e){var d=0,f=g.length;for(d;d<f;d+=1)a.ga(g[d]+"send","event",b,h,k,c,{nonInteraction:!!e})};
a.sendPageviewToAllTrackers=function(){var b=e.getAttribute("data-host");a.spilTracker("",e.getAttribute("data-ua"),b);a.spilTracker("aggregated","UA-8223336-1",b)};a.spilTrackInterval=function(){a.spilEvent("time_on_page","5_minutes_interval")};a.startSpilIntervalTracker=function(){a.setInterval(a.spilTrackInterval,3E5)};a.sendPageviewToAllTrackers();a.startSpilIntervalTracker()})(window,window.document);
</script>
<script src="//www.google-analytics.com/analytics.js" async="" defer=""></script>


        
        <script id="fontloader" data-font="">(function(c,d){var e=d.createElement("style"),f=d.getElementById("fontloader").getAttribute("data-font"),b;d.head.appendChild(e);try{if(b=c.localStorage.getItem("spilgames.fonts"))b=JSON.parse(b),b.value&&b.value.md5===f?e.innerHTML=b.value.value:(c.localStorage.removeItem("spilgames.fonts"),b=null)}catch(r){}SpilGames(["SWP","SWPEvent","DOMSelect","Net","LocalStorage"],function(g,l,m,n,p){function h(a){q&&a&&(a=[a,k,"json"].join("."),n.get("/wdg/css_aggregator-active/fonts/"+a,function(a){a.error||
(e.innerHTML=a.value,p.setItem({key:"spilgames.fonts",expires:"never",value:a}))},"json"))}g.init("css_aggregator");var k=function(){if(!/lt-ie9/.test(d.documentElement.className)){if(c.FontFace){var a=new c.FontFace("t","url('data:application/font-woff2,') format('woff2')",{});a.load()["catch"](function(){});if("loading"===a.status)return"woff2"}return"woff"}}(),q=!!k;b||h(f);l.listen("system.theme.changed",function(a){g.Widget.getSnippet({theme_changed:!0,theme_css:a.theme},function(a){var b=m.get('head link[rel="stylesheet"][href*="/themes/"]'),
c=/href="(.+?\/themes\/.+?)"/.exec(a);a=/data-font="(.+?)"/.exec(a);b&&c&&(b.href=c[1]);a&&h(a[1])})})})})(window,document);
</script><style></style>

        

        <script>if (navigator.userAgent.match(/Trident|MSIE/)) document.documentElement.className += ' ie';</script>
    <script type="text/javascript" src="//cdn.gameplayer.io/api/js/publisher.js" async=""></script></head>
//script 2==
// @name         New Coffee-Userscript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  shows how to use coffeescript compiler
// @author       You
// @require      http://coffeescript.org/extras/coffee-script.js
// @match        https://chrome.google.com/webstore/launcher
// ==tm-script==
/* jshint ignore:start */
var inline_src = (<><![CDATA[

// Your code here
    <body itemscope="itemscope" itemtype="http://schema.org/WebPage" class=" desktop"><div id="lightningjs-usabilla_live" style="display: none;"><div><iframe frameborder="0" id="lightningjs-frame-usabilla_live"></iframe></div></div>
        
        
        <div class="outer container">
            <div class="inner container narrow">
        

        

        

<div class="background-layer gamepage">
    <table class="gamewrapper">
        <tbody>
            <tr>
                <td class="left" style="display: table-cell;">
                    <div class="buttons">
                        <a href="/">
                            <img src="http://shard2.auth-83051f68-ec6c-44e0-afe5-bd8902acff57.cdn.spilcloud.com/images/1393247138.67_wide_logo_up.png" alt="Homepage">
                        </a>
                    </div>
                    <div class="leftwidth">
                        <div class="gamethumb">
                            <h1 class="outline-text">GrindCraft</h1>
                            <div class="gameinfo">
                                <div class="gamethumbimg">
                                    <div class="scale-aspect"></div>
                                    <img class="scale-img-large" src="http://files.cdn.spilcloud.com/10/1433148734_GrindCraft.jpg" alt="GrindCraft">
                                    <div class="scale-img-large gametags">
                                        
                                        <a href="/clicker-games/">
                                            <div class="button gradient-fill">clicker</div>
                                        </a>
                                        
                                        <a href="/clicking-games/">
                                            <div class="button gradient-fill">clicking</div>
                                        </a>
                                        
                                        <a href="/minecraft-games/">
                                            <div class="button gradient-fill">minecraft</div>
                                        </a>
                                        
                                        <a href="/mining-games/">
                                            <div class="button gradient-fill">mining</div>
                                        </a>
                                        
                                        <a href="/puzzle-games/">
                                            <div class="button gradient-fill">puzzle</div>
                                        </a>
                                        
                                    </div>
                                </div>
                                <div class="gameinfobar">
                                    <div class="controls-container outline-text">
                                        
                                        <div class="control">
                                            <div class="control-icon controls-mouse-left-click">&nbsp;</div>
                                        </div>
                                        
                                    </div>
                                    <div class="social-buttons-gamewrapper">
                                        <iframe class="fbLikeButton" src="https://www.facebook.com/plugins/like.php?layout=button_count&amp;width=90&amp;height=20&amp;send=false&amp;show_faces=false&amp;action=like&amp;locale=en_US&amp;href=http://www.a10.com%2Fpuzzle-games%2Fgrindcraft"></iframe>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="similar" style="visibility: visible;">
                            <h2 class="outline-text">Sponsored links</h2>
                            <div class="sponsor_sidebar" style="display: none;">
                                <div id="sgAdMrGp300x250" class=" sgAd  sgAdMr  sgAdSite121 " style="display: block;"><div class="sgAdWrapper"><div class="sgAdLabel">Advertisement</div><div class="sgAdContainer"><iframe allowtransparency="false" frameborder="0" scrolling="no" horizontalscrolling="no" verticalscrolling="no" id="iframe-sgAdMrGp300x250" seamless="seamless" src="/vda/friendly-iframe_html_40.11.19#sgAdMrGp300x250" style="margin: 0px auto; padding: 0px; overflow: hidden; border: none; display: block; width: 300px; height: 250px;"></iframe></div></div></div>
                            </div>
                        </div>
                    </div>
                </td>
                <td class="maincontent">
                       <div class="gamewindow tall" style="width: 800px; height: 619px;">
                            <div class="gamesize" style="display: none; width: 800px; height: 619px;"></div>
                            <div class="gamecontainer-floater" style="margin-bottom:-310px;"></div>
                            <div class="gamecontainer " style="width: 800px; height: 619px;">
                                <div class="gameplayer">
                                     <div id="wdg_gameplayer_embed" class="gameplayer" data-sub="cdn" data-gid="576742227280295122" data-width="100%" data-height="100%" data-props="{&quot;app_id&quot;:&quot;576742227280295122&quot;,&quot;gameplayer_environment&quot;:&quot;cdn&quot;,&quot;contentar_id&quot;:160978}" style="width: 100%; height: 100%;"><iframe width="100%" height="100%" seamless="true" webkitallowfullscreen="true" mozallowfullscreen="true" allowfullscreen="true" webkit-playsinline="true" frameborder="0" scrolling="no" name="gameplayer-576742227280295122" src="http://cdn.gameplayer.io/embed/576742227280295122/?ref=http%3A%2F%2Fwww.a10.com" style="margin: 0px; padding: 0px; border: 0px;"></iframe></div>
                                </div>
                            </div>
                        </div>
                                        
                    <div class="bottom">
                        <div class="sponsor_leaderboard" style="display: none;">
                            <div id="sgAdLbGp728x90" class="sgAd sgAdLb sgAdSite121" style="display: none;"></div>
                        </div>
                    </div>
                </td>
                <td class="right">
                    <div class="sponsor_skyscraper" style="display: none;">
                        <div id="sgAdScGp160x600" class=" sgAd  sgAdSc  sgAdSite121 " style="display: block;"><div class="sgAdWrapper"><div class="sgAdLabel">Advertisement</div><div class="sgAdContainer"><iframe allowtransparency="false" frameborder="0" scrolling="no" horizontalscrolling="no" verticalscrolling="no" id="iframe-sgAdScGp160x600" seamless="seamless" src="/vda/friendly-iframe_html_40.11.19#sgAdScGp160x600" style="margin: 0px auto; padding: 0px; overflow: hidden; border: none; display: block; width: 160px; height: 600px;"></iframe></div></div></div>
                    </div>
                </td>
            </tr>
        </tbody>
    </table>
</div>


<script>
SpilGames(['Portal', 'PageTracker', 'EventTracker'], function (Portal, PT, ET) {
    'use strict';

    Portal
        .set('portalversion',   'widgets-a10')
        .set('devicetype',      'desktop')
        .set('pagetype',        'gamepage')
        .set('pagetypedetail',  'index')
        .set('pageid',          '576742227280295122' || null)
        .set('requestid',       '0_05020A83')

        

        

        
    ;

    
    PT.track();
    
    ET.init();
});
</script>



        
            </div>
        </div>
        

        <script>
    (function () {
        window.spilgames_api = {channelid:'4', siteid:'121', apibase:'//static1.spilcdn.com/sa/3.14.0/4/121/js/'};
        window.SpilGamesBootstrap = [[function () {
            this.set('spilgames.module.import.namespaces', {});
            this.set('spilgames.module.portal.channelid', 4);
            this.set('spilgames.module.portal.siteid', 121);
            this.set('spilgames.module.spapi.backend', 'https://api.spilgames.com/');
            this.set('spilgames.portal.user.authenticated', 'false');
            this.set('spilgames.module.tracker.endpoint', 'http://logs.spilgames.com/lg/pb/1/ut/');
            this.set('spilgames.module.tracker.environment', 'live');
            this.set('spilgames.user.deviceType', 'desktop');
            this.set('spilgames.SWP.systemEvents', ['system.account.register.request','system.ad.midroll.abort','system.ad.midroll.request','system.ad.midroll.start','system.ad.midroll.heartbeat','system.ad.midroll.finish','system.ad.preroll.abort','system.ad.preroll.request','system.ad.preroll.heartbeat','system.ad.preroll.finish','system.ad.preroll.start','system.ad.module.ready','system.ad.request','system.ad.abort','system.ad.finish','system.ad.start','system.ad.heartbeat','system.auth.login.remember','system.auth.login.request','system.auth.logout.request','system.avatar.update.current','system.popup.register.open','system.popup.header.close','system.popup.header.open','system.popup.register.feedback','system.popup.login.open','system.popup.oauth.open','system.popup.oauth.close','system.popup.closed','system.login.finished','system.rate.application.update','system.rate.creation.update','system.registration.finished','system.game.area.increase','system.game.area.decrease','system.game.sidepanel.show','system.game.update.highscore','system.game.update.achievement','system.game.update.gallery','system.game.update.highscore.failed','system.game.update.achievement.failed','system.game.update.gallery.failed','system.game.zoom.show','system.game.zoom.in','system.game.zoom.out','system.notification.update.amount','system.user.search.request','system.user.search.header','system.user.search.gopage','system.popup.friend_invite.open','system.popup.social_invite.open','system.popup.profile_creations.open','system.gi.portal.feedback','system.gi.error','system.gi.update','system.gi.warning','system.gi.userdata.failure','system.gi.userdata.ready','system.gi.game.show','system.gi.game.hide','system.features.detect','system.menu.toggle','system.sound.level','system.game.break.opportunity','system.game.pause','system.game.resume','system.game.pause.request','system.game.resume.request','system.game.validated','system.game.resume.request','system.game.loaded','system.game.missingFeature','system.game.missingPlugin','system.gpwidget.blur','system.gpwidget.enable','system.gpwidget.disable','system.game.authentication.changed','system.game.orientation.changed','system.recent.played.games.update','system.game.display','system.game.break.requested','system.game.break.start','system.game.break.end','system.inlinegame.open','system.inlinegame.close','system.walkthrough.available','system.game.sidepanel.open','system.recent.played.empty','system.recent.played.filled','system.recent.played.visible','system.theme.changed','system.tile.delete','system.game.comments.visible']);
            this.set('spilgames.SWP.eventConfig', {"widget.js_aggregator":{"listen":["system.auth.login.remember","system.auth.login.request","system.auth.logout.request","system.login.finished","system.registration.finished"],"emit":["system.login.finished"]},"widget.feature_collector":{"listen":["system.features.detect","system.game.display"],"emit":[]},"widget.ads_banner":{"listen":["system.gi.update"],"emit":["system.ad.preroll.heartbeat","system.ad.preroll.finish","system.ad.preroll.start","system.ad.midroll.start","system.ad.midroll.heartbeat","system.ad.midroll.finish"]},"widget.page_game_a10":{"listen":[],"emit":["system.features.detect"]}});
            this('spilgames.loaded'); 
        }]];
    }());
</script>


<script src="/wdg/js_aggregator-active/js/minified/wdg_js_aggregator-MINIFIED-323205bf667b1e368fa93a3e8d96b48e.js" async="" defer=""></script>

<script src="/wdg/page_game_a10-active/js/minified/wdg_page_game_a10-MINIFIED-7817e2c2c0a0b95e78c6d5e1adc16a37.js" async="" defer=""></script>
<script src="/wdg/set-active/js/minified/wdg_set-MINIFIED-618b55d2a8b475a98d938ac918892494.js" async="" defer=""></script>
<script src="/wdg/performance_tracker-active/js/minified/wdg_performance_tracker-MINIFIED-adbfcee758de332d9e0a019dcc885f717796e8a5.js" async="" defer=""></script>

        
        <script>SpilGames(["JSLib","SWP","Import"],function(c,a,d){var b=window;a.init("gameplayer_embed");b.GamePlayerAPI=b.GamePlayerAPI||function(a){return function(){a.push(arguments);return a}}([]);b.GamePlayerAPI("onGameDisplay",function(){c("tracker.event.express",{eventCategory:"gameIntegration",eventAction:"update",eventLabel:"displayGame",eventValue:a.getProperty("contentar_id"),properties:{gameType:"html5"}})});d.script("//"+(a.getProperty("gameplayer_environment")||"cdn")+".gameplayer.io/api/js/publisher.js")});
</script>
        
        <script>SpilGames(["SWP","Utils","FeatureDetector","Cookie"],function(f,e,g,h){var b={ws:"websockets",ww:"webworkers",tr:"transitions",an:"animations",cv:"canvas",gl:"webgl",un:"unity",th:"touch",fl:"flash",sw:"screenWidth",sh:"screenHeight"},d={},k=function(a){var c;return(a||"").split("-").reduce(function(a,b){if(c=b.match(/(w{2})(.*)/))a[c[1]]=parseInt(c[2],10);return a},{})},l=function(a){return e.keys(a).reduce(function(c,b){c.push(b+a[b]);return c},[]).join("-")},m=function(a){return e.keys(a).reduce(function(c,
d){b[d]&&(c[b[d]]=a[d]);return c},{})};g.cookies()&&(f.init("feature_collector"),f.System.init(function(a){if("features.detect"===a.name||"game.display"===a.name)d=k(h.getItem("fd")),e.keys(b).forEach(function(a){d[a]=g[b[a]]()|0}),SpilGames("tracker.event.track",{eventCategory:"page",eventAction:"features",eventLabel:navigator.userAgent,properties:m(d)}),h.setItem({expires:"never",domain:"",path:"/",key:"fd",value:l(d)})}))});</script>
        

        
<script>(function(a,c){var d=function(){var b=c.createElement("script");b.type="text/javascript";b.async="async";b.src="//"+("https:"===a.location.protocol?"s3.amazonaws.com/cdx-radar/":"radar.cedexis.com/")+"01-10281-radar10.min.js";c.body.appendChild(b)};a.addEventListener?a.addEventListener("load",d,!1):a.attachEvent&&a.attachEvent("onload",d)})(window,document);</script>



<script>var _comscore=_comscore||[];_comscore.push({c1:"2",c2:"6035689"});(function(){var b=window.document,c,d=b.getElementsByTagName("script")[0];c=b.createElement("script");c.src="//b.scorecardresearch.com/beacon.js";d.parentNode.insertBefore(c,d);}());</script>








        <script>window.lightningjs||function(c){function g(b,d){d&&(d+=(/\?/.test(d)?"&":"?")+"lv=1");c[b]||function(){var i=window,h=document,j=b,g=h.location.protocol,l="load",k=0;(function(){function b(){a.P(l);a.w=1;c[j]("_load")}c[j]=function(){function m(){m.id=e;return c[j].apply(m,arguments)}var b,e=++k;b=this&&this!=i?this.id||0:0;(a.s=a.s||[]).push([e,b,arguments]);m.then=function(b,c,h){var d=a.fh[e]=a.fh[e]||[],j=a.eh[e]=a.eh[e]||[],f=a.ph[e]=a.ph[e]||[];b&&d.push(b);c&&j.push(c);h&&f.push(h);return m};return m};var a=c[j]._={};a.fh={};a.eh={};a.ph={};a.l=d?d.replace(/^\/\//,(g=="https:"?g:"http:")+"//"):d;a.p={0:+new Date};a.P=function(b){a.p[b]=new Date-a.p[0]};a.w&&b();i.addEventListener?i.addEventListener(l,b,!1):i.attachEvent("on"+l,b);var q=function(){function b(){return["<head></head><",c,' onload="var d=',n,";d.getElementsByTagName('head')[0].",d,"(d.",g,"('script')).",i,"='",a.l,"'\"></",c,">"].join("")}var c="body",e=h[c];if(!e)return setTimeout(q,100);a.P(1);var d="appendChild",g="createElement",i="src",k=h[g]("div"),l=k[d](h[g]("div")),f=h[g]("iframe"),n="document",p;k.style.display="none";e.insertBefore(k,e.firstChild).id=o+"-"+j;f.frameBorder="0";f.id=o+"-frame-"+j;/MSIE[ ]+[6|7|8]/.test(navigator.userAgent)&&(f[i]="javascript:false");f.allowTransparency="true";l[d](f);try{f.contentWindow[n].open()}catch(s){a.domain=h.domain,p="javascript:var d="+n+".open();d.domain='"+h.domain+"';",f[i]=p+"void(0);"}try{var r=f.contentWindow[n];r.write(b());r.close()}catch(t){f[i]=p+'d.write("'+b().replace(/"/g,String.fromCharCode(92)+'"')+'");d.close();'}a.P(2)};a.l&&setTimeout(q,0)})()}();c[b].lv="1";return c[b]}var o="lightningjs",k=window[o]=g(o);k.require=g;k.modules=c}({});window.usabilla_live = lightningjs.require("usabilla_live", "//w.usabilla.com/a6b467ef35b8.js");SpilGames(["TrackerData","Portal"],function(c,b){c.getCommonData({},function(a){a.siteid=b.get("siteid");a.channelid=b.get("channelid");window.usabilla_live("data",{custom:a})},!1)});
</script>


        <!-- 0_05020A83 -->
    
(function (global) {
	'use strict';
	// shim layer with setTimeout fallback
	var requestAnimFrame = (function () {
		return window.requestAnimationFrame       || 
		       window.webkitRequestAnimationFrame || 
		       window.mozRequestAnimationFrame    || 
		       window.oRequestAnimationFrame      || 
		       window.msRequestAnimationFrame     || 
		       function(/* function */ callback, /* DOMElement */ element){
		           window.setTimeout(callback, 1000 / 60);
		       };
	}());
	
	function getMaterial (img, trans) {
		var material = new THREE.MeshBasicMaterial({
			map: new THREE.Texture(
				img,
				new THREE.UVMapping(),
				THREE.ClampToEdgeWrapping,
				THREE.ClampToEdgeWrapping,
				THREE.NearestFilter,
				THREE.NearestFilter,
				(trans? THREE.RGBAFormat : THREE.RGBFormat)
			),
			transparent: trans
		});
		material.map.needsUpdate = true;
		console.log(material);
		
		return material;
	};
	function uvmap (mesh, face, x, y, w, h, rotateBy) {
		if(!rotateBy) rotateBy = 0;
		var uvs = mesh.geometry.faceVertexUvs[0][face];
		var tileU = x;
		var tileV = y;
		var tileUvWidth = 1/256;
		var tileUvHeight = 1/256;
		
		uvs[ (0 + rotateBy) % 4 ].u = tileU * tileUvWidth;
		uvs[ (0 + rotateBy) % 4 ].v = tileV * tileUvHeight;
		uvs[ (1 + rotateBy) % 4 ].u = tileU * tileUvWidth;
		uvs[ (1 + rotateBy) % 4 ].v = tileV * tileUvHeight + h * tileUvHeight;
		uvs[ (2 + rotateBy) % 4 ].u = tileU * tileUvWidth + w * tileUvWidth;
		uvs[ (2 + rotateBy) % 4 ].v = tileV * tileUvHeight + h * tileUvHeight;
		uvs[ (3 + rotateBy) % 4 ].u = tileU * tileUvWidth + w * tileUvWidth;
		uvs[ (3 + rotateBy) % 4 ].v = tileV * tileUvHeight;
	};
	
	function createItem (id) {
		
		var imgdata = itemsc.getImageData(Math.floor(id % 16)*16, Math.floor(id / 16)*16, 16, 16);
		var imd = imgdata.data;
		
		var geo = new THREE.Geometry();
		
		for(var x=0; x < 16; x++) {
			for(var y=0; y < 16; y++) {
				if(imd[(x+y*16)*4+3] === 0) {
					continue;
				}
				
				var voxel = new THREE.Mesh(new THREE.CubeGeometry(1, 1, 1), itemsMaterial);
				for(var i=0; i < 6; i++) {
					uvmap(voxel, i, Math.floor(id % 16)*16+x, Math.floor(id / 16)*16+y, 1, 1);
				}
				
				voxel.position.x = x-8;
				voxel.position.y = -(y-8);
				THREE.GeometryUtils.merge(geo, voxel);
			}
		}
		
		var mesh = new THREE.Mesh(geo,itemsMaterial );
		
		return mesh;
	};
	
	function render () {
		requestAnimFrame(render, renderer.domElement);
		
		var time = (Date.now() - startTime)/1000;
		
		camera.position.x = -Math.cos(time/2);
		camera.position.z = -Math.sin(time/2);
		camera.position.y = 0.25*Math.sin(time);
		camera.position.setLength(150-Math.cos(time)*50);
		camera.lookAt(new THREE.Vector3(0, Math.cos(time/3)*50, 0));
		
		var rot = time*1.5;
		
		for(var i=0; i < itemsmeshes.length; i++) {
			itemsmeshes[i].rotation.y = (i%2 === 0 ? -1 : 1)*rot+i;
		}
		
		renderer.render(scene, camera);
	};
	
	var startTime = Date.now();
	
	
	var container = global.document.querySelector('#container');
	
	var itemscanvas = global.document.createElement('canvas');
	itemscanvas.width = 256;
	itemscanvas.height = 256;
	var itemsc = itemscanvas.getContext('2d');
	var itemsMaterial = getMaterial(itemscanvas, true);
	
	var w = global.innerWidth, h = global.innerHeight;
	
	var scene = new THREE.Scene();
	
	var camera = new THREE.PerspectiveCamera(35, w / h, 1, 1000);
	scene.add(camera);
	
	var renderer = new THREE.WebGLRenderer({antialias: false});
	renderer.setSize(w, h);
	renderer.setClearColorHex(0x000000, 0.0);
	container.appendChild(renderer.domElement);
	
	var itemsmeshes = [];
	
	render();
	
	var items = new Image();
	items.onload = function () {
		
		itemsc.clearRect(0, 0, itemscanvas.width, itemscanvas.height);
		itemsc.drawImage(items, 0, 0);
		//itemsMaterial.map.needsUpdate = true;
		
		for(var i=0; i < 16*16; i++) {
			var item = createItem(i);
			item.position.x = Math.random()*200-100;
			item.position.y = Math.random()*256-128;
			item.position.z = Math.random()*200-100;
			scene.add(item);
			itemsmeshes.push(item);
		}
	};
	
	items.src = "items.png";
	
	
}(window));
<script type="text/javascript" src="//static1.spilcdn.com/sa/3.14.0/4/121/js/spilgames.api.js" async=""></script><script type="text/javascript" async="" src="//radar.cedexis.com/01-10281-radar10.min.js"></script></body>
var this = third-4
]]></>).toString();
var compiled = this.CoffeeScript.compile(inline_src);
eval(compiled);
/* jshint ignore:end */    
    
/* jshint ignore:start */
]]></>).toString();
var c = babel.transform(inline_src);
eval(c.code);
/* jshint ignore:start */
var http = require('q-io/http'),
    BufferStream = require('q-io/buffer-stream'),
    Url = require('url'),
    _ = require('underscore'),
    version = require('../../package.json').version,
    debug = require('debug')('blaze-in:middleware:minecraft'),
    inspect = require('sys').inspect,
    sprintf = require('util').format,
    uuid = require('node-uuid');

function AuthenticationError(data) {
  if (data.error && data.errorMessage) {
    this.name = data.error;
    this.message = data.errorMessage;
  } else {
    this.name = 'AuthentiationError';
    this.message = data;
  }
}

AuthenticationError.prototype = Error.prototype;

function Minecraft(req, res, next) {
  if (!(this instanceof Minecraft)) {
    return new Minecraft(req);
  }

  this.req = req;
  this.host = Url.parse(this.req.app.get('mojang authserver'));
}

Minecraft.prototype.request = function(pathname, body, method) {
  var url = _.extend({}, this.host, {pathname: pathname});

  var req = {
    url: Url.format(url),
    body: new BufferStream(JSON.stringify(body)),
    method: method,
    headers: {
      Accepts: 'application/json',
      'User-Agent': 'blaze-in/'+version+' +rcorsaro@gmail.com'
    }
  }

  debug(">> %s %s", req.method, req.url);
  debug(">> %s", JSON.stringify(body));

  if (method === 'POST') {
    req.headers['Content-Type'] = 'application/json';
  }
  return http.request(req)
    .then(function(res) {
      return [res, res.body.read()];
    })
    .spread(function(res, body) {
      debug("<< %d %s %s", res.status, req.method, req.url);
      debug("<< %s", body);
      try {
        res.data = JSON.parse(body);
      } catch(e) {
        res.data = body;
      }
      return res;
    });
}

Minecraft.prototype.authenticate = function(username, password) {
  var body = {
    agent: {
      name: 'Minecraft',
      version: 1
    },
    username: username,
    password: password,
    clientToken: uuid.v4()
  };

  return this.request('authenticate', body, 'POST')
    .then(function(res) {
      if (res.status === 200) {
        return res.data;
      } else {
        throw new AuthenticationError(res.data);
      }
    });
}

Minecraft.prototype.invalidate = function(accessToken, clientToken) {
  return this.request('invalidate', {accessToken: accessToken, clientToken: clientToken})
    .then(function(res) {
      return res.status === 200;
    });
}

exports = module.exports = function() {
  return function(req, res, next) {
    req.minecraft = Minecraft(req);
    next();
  }
}
body {
    margin: 0px;
    overflow: hidden;
}

.content {
    position: relative;
    width: 100%;
    height: 100%;
}

.cursor {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
    width: 5px;
    height: 5px;
    background-color: rgba(1, 1, 1, 0.5);
}

.chat {
    position: absolute;
    left: 0;
    bottom: 20px;
    width: 400px;
    min-height: 1em;
    background-color: rgba(1, 1, 1, 0.4);
    color: white;
}

#mc {
    position: absolute;
    left: 0px;
    right: 0px;
    top: 0px;
    bottom: 0px;
}

.overlay {
    position: absolute;
    left: 0px;
    right: 0px;
    top: 0px;
    bottom: 0px;
    background: #2E1A0A;
}

.overlay .loading {
    position: absolute;
    width: 80%;
    height: 80px;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
    background: #160D06;
    padding: 10px;
}

.overlay .loading .bar {
    background: #032046;
    width: 0;
    height: 100%;
    transition: width 1s ease-in-out;
}

.overlay .auth {
    position: absolute;
    width: 300px;
    height: 200px;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
    background: #160D06;
    padding: 10px;
    display: none;
}

.overlay .auth input {
    width: 100%;
    height: 70px;
    margin-bottom: 10px;
    box-sizing: border-box;
    font: inherit;
    font-size: 40px;
    background: #2E1A0A;
    border: none;
}

.overlay .auth button {
    width: 100%;
    height: 40px;
    box-sizing: border-box;
    font: inherit;
    background: #2E1A0A;
    border: none;
}

.overlay .auth button:hover {
    background: #1F1107;
}
#!/usr/bin/env node

var mineos = require('./mineos');
var server = require('./server');
var async = require('async');

var express = require('express');
var passport = require('passport');
var LocalStrategy = require('passport-local');
var passportSocketIO = require("passport.socketio");
var expressSession = require('express-session');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var cookieParser = require('cookie-parser');

var sessionStore = new expressSession.MemoryStore();
var app = express();
var http = require('http').Server(app);

var response_options = {root: __dirname};

// Authorization
var localAuth = function (username, password) {
  var Q = require('q');
  var auth = require('./auth');
  var deferred = Q.defer();

  auth.authenticate_shadow(username, password, function(authed_user) {
  	if (authed_user)
		deferred.resolve({ username: authed_user });
	else
		deferred.reject(new Error('incorrect password'));
  })

  return deferred.promise;
}

// Passport init
passport.serializeUser(function(user, done) {
  //console.log("serializing " + user.username);
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  //console.log("deserializing " + obj);
  done(null, obj);
});

// Use the LocalStrategy within Passport to login users.
passport.use('local-signin', new LocalStrategy(
  {passReqToCallback : true}, //allows us to pass back the request to the callback
  function(req, username, password, done) {
    localAuth(username, password)
    .then(function (user) {
      if (user) {
        console.log('Successful login attempt for username:', username);
        done(null, user);
      }
    })
    .fail(function (err) {
      console.log('Unsuccessful login attempt for username:', username);
      done(null);
    });
  }
));

// clean up sessions that go stale over time
function session_cleanup() {
  //http://stackoverflow.com/a/10761522/1191579
  sessionStore.all(function(err, sessions) {
    for (var i = 0; i < sessions.length; i++) {
      sessionStore.get(sessions[i], function() {} );
    }
  });
}

// Simple route middleware to ensure user is authenticated.
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  req.session.error = 'Please sign in!';
  res.redirect('/admin/login.html');
}

app.use(bodyParser.urlencoded({extended: false}));
app.use(methodOverride());
app.use(expressSession({ 
  secret: 'session_secret', 
  key:'express.sid', 
  store: sessionStore,
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

var io = require('socket.io')(http)
io.use(passportSocketIO.authorize({
  cookieParser: cookieParser,       // the same middleware you registrer in express
  key:          'express.sid',       // the name of the cookie where express/connect stores its session_id
  secret:       'session_secret',    // the session_secret to parse the cookie
  store:        sessionStore        // we NEED to use a sessionstore. no memorystore please
}));

function tally(callback) {
  var os = require('os');
  var urllib = require('urllib');
  var child_process = require('child_process');

  var tally_info = {
    sysname: os.type(), 
    release: os.release(), 
    nodename: os.hostname(),
    version: '',
    machine: process.arch
  }

  child_process.execFile('uname', ['-v'], function(err, output) {
    if (!err)
      tally_info['version'] = output.replace(/\n/,'');
    urllib.request('http://minecraft.codeemo.com/tally/tally-node.py', {data: tally_info}, function(){});
  })
}

function read_ini(filepath) {
  var ini = require('ini');
  var fs = require('fs');
  try {
    var data = fs.readFileSync(filepath);
    return ini.parse(data.toString());
  } catch (e) {
    return null;
  }
}

mineos.dependencies(function(err, binaries) {
  if (err) {
    console.error('MineOS is missing dependencies:', err);
    console.log(binaries);
    process.exit(1);
  } 

  var fs = require('fs-extra');

  var mineos_config = read_ini('/etc/mineos.conf') || read_ini('/usr/local/etc/mineos.conf') || {};
  var base_directory = '/var/games/minecraft';

  if ('base_directory' in mineos_config) {
    try {
      if (mineos_config['base_directory'].length < 2)
        throw new error('Invalid base_directory length.');

      base_directory = mineos_config['base_directory'];
      fs.ensureDirSync(base_directory);

    } catch (e) {
      console.error(e.message, 'Aborting startup.');
      process.exit(2); 
    }

    console.info('base_directory found in mineos.conf, using:', base_directory);
  } else {
    console.info('base_directory not specified in mineos.conf, using default:', base_directory);
  }

  var be = new server.backend(base_directory, io);

  tally();
  setInterval(tally, 7200000); //7200000 == 120min

	app.get('/', function(req, res){
		res.redirect('/admin/index.html');
	});

	app.get('/admin/index.html', ensureAuthenticated, function(req, res){
		res.sendfile('/html/index.html', response_options);
	});

	app.get('/login', function(req, res){
		res.sendfile('/html/login.html');
	});

	app.post('/auth', passport.authenticate('local-signin', {
		successRedirect: '/admin/index.html',
		failureRedirect: '/admin/login.html'
		})
	);

	app.get('/logout', function(req, res){
		req.logout();
		res.redirect('/admin/login.html');
	});

	app.use('/socket.io', express.static(__dirname + '/node_modules/socket.io'));
	app.use('/angular', express.static(__dirname + '/node_modules/angular'));
	app.use('/angular-translate', express.static(__dirname + '/node_modules/angular-translate/dist'));
	app.use('/moment', express.static(__dirname + '/node_modules/moment'));
	app.use('/angular-moment', express.static(__dirname + '/node_modules/angular-moment'));
	app.use('/angular-moment-duration-format', express.static(__dirname + '/node_modules/moment-duration-format/lib'));
  app.use('/angular-sanitize', express.static(__dirname + '/node_modules/angular-sanitize'));
	app.use('/admin', express.static(__dirname + '/html'));

	process.on('SIGINT', function() {
		console.log("Caught interrupt signal; closing webui....");
		be.shutdown();
		process.exit();
	});

  var SOCKET_PORT = null;
  var SOCKET_HOST = '0.0.0.0';
  var USE_HTTPS = true;

  if ('use_https' in mineos_config)
    USE_HTTPS = mineos_config['use_https'];

  if ('socket_host' in mineos_config)
    SOCKET_HOST = mineos_config['socket_host'];

  if ('socket_port' in mineos_config)
    SOCKET_PORT = mineos_config['socket_port'];
  else
    if (USE_HTTPS)
      SOCKET_PORT = 8443;
    else
      SOCKET_PORT = 8080;

  if (USE_HTTPS)
    async.parallel({
      key: async.apply(fs.readFile, mineos_config['ssl_private_key'] || '/etc/ssl/certs/mineos.key'),
      cert: async.apply(fs.readFile, mineos_config['ssl_certificate'] || '/etc/ssl/certs/mineos.crt')
    }, function(err, ssl) {
      if (err) {
        console.error('Could not locate required SSL files /etc/ssl/certs/mineos.{key,crt}, aborting server start.');
        process.exit(3);
      } else {
        var https = require('https');

        if ('ssl_cert_chain' in mineos_config) {
          try {
            var cert_chain_data = fs.readFileSync(mineos_config['ssl_cert_chain']);
            if (cert_chain_data.length)
              ssl['ca'] = cert_chain_data;
          } catch (e) {}
        }

        var https_server = https.createServer(ssl, app).listen(SOCKET_PORT, SOCKET_HOST, function() {
          io.attach(https_server);
          console.log('MineOS webui listening on HTTPS://' + SOCKET_HOST + ':' + SOCKET_PORT);
        });
      }
    })
  else {
    console.warn('mineos.conf set to host insecurely: starting HTTP server.');
    http.listen(SOCKET_PORT, SOCKET_HOST, function(){
      console.log('MineOS webui listening on HTTP://' + SOCKET_HOST + ':' + SOCKET_PORT);
    });
  }

  setInterval(session_cleanup, 3600000); //check for expired sessions every hour

})

#!/usr/bin/env node

var daemon = require("daemonize2").setup({
    main: "webui.js",
    name: "mineos",
    pidfile: "/var/run/mineos.pid"
});

if (process.getuid() != 0) {
    console.log("Expected to run as root");
    process.exit(1);
}

switch (process.argv[2]) {
    case "start":
        daemon.start();
        break;
    case "stop":
        daemon.stop();
        break;
    case "restart":
        daemon.stop(function(err) {
            daemon.start();
        });
        break;
    case "status":
        var pid = daemon.status();
        if (pid)
            console.log("MineOS running. PID: " + pid);
        else
            console.log("MineOS is not running.");
        break;
    default:
        console.log("Usage: [start|stop|restart|status]");
}
var mineos = require('./mineos');
var async = require('async');
var path = require('path');
var events = require('events');
var os = require('os');
var logging = require('winston');
var fs = require('fs-extra');
var server = exports;

logging.add(logging.transports.File, {
  filename: '/var/log/mineos.log',
  handleExceptions: true
});

server.backend = function(base_dir, socket_emitter) {
  var self = this;

  self.servers = {};
  self.profiles = [];
  self.front_end = socket_emitter;
  self.commit_msg = '';

  process.umask(0002);

  fs.ensureDirSync(base_dir);
  fs.ensureDirSync(path.join(base_dir, mineos.DIRS['servers']));
  fs.ensureDirSync(path.join(base_dir, mineos.DIRS['backup']));
  fs.ensureDirSync(path.join(base_dir, mineos.DIRS['archive']));
  fs.ensureDirSync(path.join(base_dir, mineos.DIRS['import']));
  fs.ensureDirSync(path.join(base_dir, mineos.DIRS['profiles']));

  fs.chmod(path.join(base_dir, mineos.DIRS['import']), 0777);

  (function() {
    var which = require('which');

    async.waterfall([
      async.apply(which, 'git'),
      function(path, cb) {
        var child = require('child_process');
        var opts = {cwd: __dirname};
        child.execFile(path, [ 'show', '--oneline', '-s' ], opts, cb);
      },
      function(stdout, stderr, cb) {
        self.commit_msg = (stdout ? stdout : '');
        logging.info('Starting up server, using commit:', self.commit_msg);
        cb();
      }
    ])
  })();

  (function() {
    //thanks to https://github.com/flareofghast/node-advertiser/blob/master/advert.js
    var dgram = require('dgram');
    var udp_broadcaster = {};
    var UDP_DEST = '255.255.255.255';
    var UDP_PORT = 4445;
    var BROADCAST_DELAY_MS = 4000;

    async.forever(
      function(next) {
        for (var s in self.servers) {
          self.servers[s].broadcast_to_lan(function(msg, server_ip) {
            if (msg) {
              if (udp_broadcaster[server_ip]) {
                udp_broadcaster[server_ip].send(msg, 0, msg.length, UDP_PORT, UDP_DEST);
              } else {
                udp_broadcaster[server_ip] = dgram.createSocket('udp4');
                udp_broadcaster[server_ip].bind(UDP_PORT, server_ip);
                udp_broadcaster[server_ip].on("listening", function () {
                  udp_broadcaster[server_ip].setBroadcast(true);
                  udp_broadcaster[server_ip].send(msg, 0, msg.length, UDP_PORT, UDP_DEST);
                });
                udp_broadcaster[server_ip].on("error", function (err) {
                  logging.error("Cannot bind broadcaster to ip " + server_ip);
                });
              }
            }
          })
        }
        setTimeout(next, BROADCAST_DELAY_MS);
      }
    )
  })();

  (function() {
    var HOST_HEARTBEAT_DELAY_MS = 1000;

    function host_heartbeat() {
      self.front_end.emit('host_heartbeat', {
        'uptime': os.uptime(),
        'freemem': os.freemem(),
        'loadavg': os.loadavg()
      })
    }

    setInterval(host_heartbeat, HOST_HEARTBEAT_DELAY_MS);
  })();

  (function() {
    var fireworm = require('fireworm');
    var server_path = path.join(base_dir, mineos.DIRS['servers']);
    
    var fw = fireworm(server_path);
    fw.add('**/server.properties');

    fw
      .on('add', function(fp){
        var server_name = path.basename(path.dirname(fp));
        if (!(server_name in self.servers))
          async.nextTick(function() {
            self.servers[server_name] = new server_container(server_name, base_dir, self.front_end);
            self.front_end.emit('track_server', server_name);
          });
      })
      .on('remove', function(fp) {
        var server_name = path.basename(path.dirname(fp));
        try {
          self.servers[server_name].cleanup();
          delete self.servers[server_name];
        } catch (e) {
          //if server has already been deleted and this is running for reasons unknown, catch and ignore
        }
        self.front_end.emit('untrack_server', server_name);
      })
  })();

  (function() {
    var fireworm = require('fireworm');
    var importable_archives = path.join(base_dir, mineos.DIRS['import']);

    var fw = fireworm(importable_archives);
    fw.add('**/*.zip');
    fw.add('**/*.tar');
    fw.add('**/*.tgz');
    fw.add('**/*.tar.gz');
    
    fw
      .on('add', function(fp) {
        logging.info('[WEBUI] New file found in import directory', fp);
        self.send_importable_list();
      })
      .on('remove', function(fp) {
        logging.info('[WEBUI] File removed from import directory', fp);
        self.send_importable_list();
      })
  })();

  self.start_servers = function() {
    var MS_TO_PAUSE = 10000;

    async.eachLimit(
      Object.keys(self.servers),
      1,
      function(server_name, callback) {
        self.servers[server_name].onreboot_start(function(err) {
          if (err)
            logging.error('[{0}] Aborted server startup; condition not met:'.format(server_name), err);
          else
            logging.info('[{0}] Server started. Waiting {1} ms...'.format(server_name, MS_TO_PAUSE));
            
          setTimeout(callback, (err ? 1 : MS_TO_PAUSE));
        });
      },
      function(err) {}
    )
  }

  setTimeout(self.start_servers, 5000);

  self.shutdown = function() {
    for (var server_name in self.servers)
      self.servers[server_name].cleanup();
  }

  self.send_profile_list = function(send_existing) {
    if (send_existing && self.profiles.length) //if requesting to just send what you already have AND they are already present
      self.front_end.emit('profile_list', self.profiles);
    else
      check_profiles(base_dir, function(err, all_profiles) {
        if (!err)
          self.profiles = all_profiles;
        self.front_end.emit('profile_list', self.profiles);
      })
  }

  self.send_spigot_list = function() {
    var profiles_dir = path.join(base_dir, mineos.DIRS['profiles']);
    var spigot_profiles = {};

    async.waterfall([
      async.apply(fs.readdir, profiles_dir),
      function(listing, cb) {
        for (var i in listing) {
          var match = listing[i].match(/spigot_([\d\.]+)/);
          if (match)
            spigot_profiles[match[1]] = {
              'directory': match[0],
              'jarfiles': fs.readdirSync(path.join(profiles_dir, match[0])).filter(function(a) { return a.match(/.+\.jar/i) })
            }
        }
        cb();
      }
    ], function(err) {
      self.front_end.emit('spigot_list', spigot_profiles);
    })
  }

  self.front_end.on('connection', function(socket) {
    var userid = require('userid');
    var fs = require('fs-extra');

    var ip_address = socket.request.connection.remoteAddress;
    var username = socket.request.user.username;
   
    var OWNER_CREDS = {
      uid: userid.uid(username),
      gid: userid.gid(username)
    } 

    function webui_dispatcher (args) {
      logging.info('[WEBUI] Received emit command from {0}:{1}'.format(ip_address, username), args);
      switch (args.command) {
        case 'create':
          var instance = new mineos.mc(args.server_name, base_dir);

          async.series([
            async.apply(instance.verify, '!exists'),
            async.apply(instance.create, OWNER_CREDS),
            async.apply(instance.overlay_sp, args.properties),
          ], function(err, results) {
            if (!err)
              logging.info('[{0}] Server created in filesystem.'.format(args.server_name));
            else
              logging.error(err);
          })
          break;
        case 'create_unconventional_server':
          var instance = new mineos.mc(args.server_name, base_dir);

          async.series([
            async.apply(instance.verify, '!exists'),
            async.apply(instance.create_unconventional_server, OWNER_CREDS),
          ], function(err, results) {
            if (!err)
              logging.info('[{0}] Server (unconventional) created in filesystem.'.format(args.server_name));
            else
              logging.error(err);
          })
          break;
        case 'download':
          function progress_emitter(args) {
            self.front_end.emit('file_progress', args);
          }

          for (var idx in self.profiles)
            if (self.profiles[idx].id == args.profile.id) {
              download_profiles(base_dir, self.profiles[idx], progress_emitter, function(retval){
                self.front_end.emit('host_notice', retval);
                self.send_profile_list();
              });
              break;
            }
              
          break;
        case 'build_jar':
          var which = require('which');
          var child_process = require('child_process');

          try {
            var profile_path = path.join(base_dir, mineos.DIRS['profiles']);
            var working_dir = path.join(profile_path, 'spigot_{0}'.format(args.version));
            var bt_path = path.join(profile_path, args.builder.id, args.builder.filename);
            var dest_path = path.join(working_dir, args.builder.filename);
            var params = { cwd: working_dir };
          } catch (e) {
            logging.error('[WEBUI] Could not build jar; insufficient/incorrect arguments provided:', args);
            logging.error(e);
            return;
          }

          async.series([
            async.apply(fs.mkdir, working_dir),
            async.apply(fs.copy, bt_path, dest_path),
            function(cb) {
              var binary = which.sync('java');
              var proc = child_process.spawn(binary, ['-jar', dest_path, '--rev', args.version], params);

              proc.stdout.on('data', function (data) {
                self.front_end.emit('build_jar_output', data.toString());
                //logging.log('stdout: ' + data);
              });

              logging.info('[WEBUI] BuildTools starting with arguments:', args)

              proc.stderr.on('data', function (data) {
                self.front_end.emit('build_jar_output', data.toString());
                logging.error('stderr: ' + data);
              });

              proc.on('close', function (code) {
                cb(code);
              });
            }
          ], function(err, results) {
            logging.info('[WEBUI] BuildTools jar compilation finished {0} in {1}'.format( (err ? 'unsuccessfully' : 'successfully'), working_dir));
            logging.info('[WEBUI] Buildtools used: {0}'.format(dest_path));

            var retval = {
              'command': 'BuildTools jar compilation',
              'success': true,
              'help_text': ''
            }

            if (err) {
              retval['success'] = false;
              retval['help_text'] = "Error {0} ({1}): {2}".format(err.errno, err.code, err.path);
            }

            self.front_end.emit('host_notice', retval);
            self.send_spigot_list();
          })
          break;
        case 'delete_build':
          var spigot_path = path.join(base_dir, mineos.DIRS['profiles'], 'spigot_' + args.version);
          fs.remove(spigot_path, function(err) {
            var retval = {
              'command': 'Delete BuildTools jar',
              'success': true,
              'help_text': ''
            }

            if (err) {
              retval['success'] = false;
              retval['help_text'] = "Error {0}".format(err);
            }

            self.front_end.emit('host_notice', retval);
            self.send_spigot_list();
          })
          break;
        case 'copy_to_server':
          var rsync = require('rsync');
          var spigot_path = path.join(base_dir, mineos.DIRS['profiles'], 'spigot_' + args.version) + '/';
          var dest_path = path.join(base_dir, mineos.DIRS['servers'], args.server_name) + '/';
          
          var obj = rsync.build({
            source: spigot_path,
            destination: dest_path,
            flags: 'au',
            shell:'ssh'
          });

          obj.set('--include', '*.jar');
          obj.set('--exclude', '*');
          obj.set('--prune-empty-dirs');
          obj.set('--chown', '{0}:{1}'.format(OWNER_CREDS.uid, OWNER_CREDS.gid));

          obj.execute(function(error, code, cmd) {
            var retval = {
              'command': 'BuildTools jar copy',
              'success': true,
              'help_text': ''
            }

            if (error) {
              retval['success'] = false;
              retval['help_text'] = "Error {0} ({1})".format(error, code);
            }

            self.front_end.emit('host_notice', retval);
            for (var s in self.servers)
              self.front_end.emit('track_server', s);
          });

          break;
        case 'refresh_server_list':
          for (var s in self.servers)
            self.front_end.emit('track_server', s);
          break;
        case 'refresh_profile_list':
          self.send_profile_list();
          break;
        case 'refresh_spigot_list':
          self.send_spigot_list();
          break;
        case 'create_from_archive':
          var instance = new mineos.mc(args.new_server_name, base_dir);

          if (args.awd_dir)
            var filepath = path.join(instance.env.base_dir, mineos.DIRS['archive'], args.awd_dir, args.filename);
          else
            var filepath = path.join(instance.env.base_dir, mineos.DIRS['import'], args.filename);

          async.series([
            async.apply(instance.verify, '!exists'),
            async.apply(instance.create_from_archive, OWNER_CREDS, filepath)
          ], function(err, results) {
            if (!err)
              logging.info('[{0}] Server created in filesystem.'.format(args.new_server_name));
            else
              logging.error(err);
          })
          break;
        default:
          logging.warn('Command ignored: no such command {0}'.format(args.command));
          break;
      }
    }

    self.send_user_list = function() {
      var passwd = require('etc-passwd');
      var users = [];
      var groups = [];

      var gu = passwd.getUsers()
        .on('user', function(user_data) {
          if (user_data.username == username)
            users.push({
              username: user_data.username,
              uid: user_data.uid,
              gid: user_data.gid,
              home: user_data.home
            })
        })
        .on('end', function() {
          socket.emit('user_list', users);
        })

      var gg = passwd.getGroups()
        .on('group', function(group_data) {
          if (group_data.users.indexOf(username) >= 0 || group_data.gid == userid.gid(username)) {
            if (group_data.gid > 0) {
              groups.push({
                groupname: group_data.groupname,
                gid: group_data.gid
              })
            }
          }
        })
        .on('end', function() {
          socket.emit('group_list', groups);
        })
    }

    logging.info('[WEBUI] {0} connected from {1}'.format(username, ip_address));
    socket.emit('whoami', username);
    socket.emit('commit_msg', self.commit_msg);

    for (var server_name in self.servers)
      socket.emit('track_server', server_name);

    socket.on('command', webui_dispatcher);
    self.send_user_list();
    self.send_profile_list(true);
    self.send_spigot_list();
    self.send_importable_list();

  })

  self.send_importable_list = function() {
    var importable_archives = path.join(base_dir, mineos.DIRS['import']);
    var all_info = [];

    fs.readdir(importable_archives, function(err, files) {
      if (!err) {
        var fullpath = files.map(function(value, index) {
          return path.join(importable_archives, value);
        });

        var stat = fs.stat;
        async.map(fullpath, stat, function(inner_err, results){
          results.forEach(function(value, index) {
            all_info.push({
              time: value.mtime,
              size: value.size,
              filename: files[index]
            })
          })

          all_info.sort(function(a, b) {
            return a.time.getTime() - b.time.getTime();
          });

          self.front_end.emit('archive_list', all_info);
        }); 
      }
    })
  }

  return self;
}

function server_container(server_name, base_dir, socket_io) {
  // when evoked, creates a permanent 'mc' instance, namespace, and place for file tails. 
  var self = this;
  var instance = new mineos.mc(server_name, base_dir),
      nsp = socket_io.of('/{0}'.format(server_name)),
      tails = {},
      notices = [],
      cron = {},
      heartbeat_interval = null,
      HEARTBEAT_INTERVAL_MS = 5000;

  logging.info('[{0}] Discovered server'.format(server_name));
  async.series([ async.apply(instance.sync_chown) ]);

  make_tail('logs/latest.log');
  make_tail('server.log');
  make_tail('proxy.log.0');

  (function() {
    var fireworm = require('fireworm');
    var fw = fireworm(instance.env.cwd);

    fw.add('**/server.properties');
    fw.add('**/server.config');
    fw.add('**/cron.config');
    fw.add('**/eula.txt');
    fw.add('**/server-icon.png');
    fw.add('**/config.yml');
    
    function handle_event(fp) {
      var FS_DELAY = 250; 
      // because it is unknown when fw triggers on add/change and
      // further because if it catches DURING the write, it will find
      // the file has 0 size, adding arbitrary delay.
      // process.nexttick didnt work.
      var file_name = path.basename(fp);
      switch (file_name) {
        case 'server.properties':
          setTimeout(broadcast_sp, FS_DELAY);
          break;
        case 'server.config':
          setTimeout(broadcast_sc, FS_DELAY);
          break;
        case 'cron.config':
          setTimeout(broadcast_cc, FS_DELAY);
          break;
        case 'eula.txt':
          setTimeout(emit_eula, FS_DELAY);
          break;
        case 'server-icon.png':
          setTimeout(broadcast_icon, FS_DELAY);
          break;
        case 'config.yml':
          setTimeout(broadcast_cy, FS_DELAY);
          break;
      }
    }
    
    fw.on('add', handle_event);
    fw.on('change', handle_event);
  })();

  heartbeat_interval = setInterval(heartbeat, HEARTBEAT_INTERVAL_MS);

  function heartbeat() {
    async.series({
      'up': function(cb) { instance.property('up', function(err, is_up) { cb(null, is_up) }) },
      'memory': function(cb) { instance.property('memory', function(err, mem) { cb(null, err ? {} : mem) }) },
      'ping': function(cb) {
        instance.property('unconventional', function(err, is_unconventional) {
          if (is_unconventional)
            cb(null, {}); //ignore ping--wouldn't respond in any meaningful way
          else
            instance.property('ping', function(err, ping) { cb(null, err ? {} : ping) }) 
        })
      },
      'query': function(cb) {
        instance.property('server.properties', function(err, dict) {
          if (dict['enable-query'])
            instance.property('query', cb);
          else
            cb(null, {}); //ignore query--wouldn't respond in any meaningful way
        })
      }
    }, function(err, retval) {
      nsp.emit('heartbeat', {
        'server_name': server_name,
        'timestamp': Date.now(),
        'payload': retval
      })
    })
  }

  (function() {
    var CronJob = require('cron').CronJob;

    function cron_dispatcher(args) {
      var introspect = require('introspect');
      var fn, required_args;
      var arg_array = [];

      fn = instance[args.command];
      required_args = introspect(fn);

      for (var i in required_args) {
        // all callbacks expected to follow the pattern (success, payload).
        if (required_args[i] == 'callback') 
          arg_array.push(function(err, payload) {
            args.success = !err;
            args.err = err;
            args.time_resolved = Date.now();
            if (err)
              logging.error('[{0}] command "{1}" errored out:'.format(server_name, args.command), args);
          })
        else if (required_args[i] in args) {
          arg_array.push(args[required_args[i]])
        }
      }

      fn.apply(instance, arg_array);
    }

    instance.crons(function(err, cron_dict) {
      for (var cronhash in cron_dict) {
        if (cron_dict[cronhash].enabled) {
          try {
            cron[cronhash] = new CronJob({
              cronTime: cron_dict[cronhash].source,
              onTick: function() {
                cron_dispatcher(this);
              },
              start: true,
              context: cron_dict[cronhash]
            });
          } catch (e) {
            // catches invalid cron expressions
            logging.warn('[{0}] invalid cron expression:'.format(server_name), cronhash, cron_dict[cronhash]);
            instance.set_cron(cronhash, false, function(){});
          }
        }
      }
    })
  })();

  self.broadcast_to_lan = function(callback) {
    async.waterfall([
      async.apply(instance.verify, 'exists'),
      async.apply(instance.verify, 'up'),
      async.apply(instance.sc),
      function(sc_data, cb) {
        var broadcast_value = (sc_data.minecraft || {}).broadcast;
        cb(!broadcast_value) //logically notted to make broadcast:true pass err cb
      },
      async.apply(instance.sp)
    ], function(err, sp_data) {
      if (err)
        callback(null);
      else {
        var msg = new Buffer("[MOTD]" + sp_data.motd + "[/MOTD][AD]" + sp_data['server-port'] + "[/AD]");
        var server_ip = sp_data['server-ip'];
        callback(msg, server_ip);
      }
    })
  }

  self.onreboot_start = function(callback) {
    async.waterfall([
      async.apply(instance.property, 'onreboot_start'),
      function(autostart, cb) {
        logging.info('[{0}] autostart = {1}'.format(server_name, autostart));
        cb(!autostart); //logically NOT'ing so that autostart = true continues to next func
      },
      async.apply(instance.start)
    ], function(err) {
      callback(err);
    })
  }

  self.cleanup = function () {
    for (var t in tails)
      tails[t].unwatch();

    clearInterval(heartbeat_interval);
    nsp.removeAllListeners();
  }

  function emit_eula() {
    var fs = require('fs-extra');
    var eula_path = path.join(instance.env.cwd, 'eula.txt');

    async.waterfall([
      async.apply(instance.property, 'eula'),
      function(accepted, cb) {
        logging.info('[{0}] eula.txt detected: {1} (eula={2})'.format(server_name,
                                                                     (accepted ? 'ACCEPTED' : 'NOT YET ACCEPTED'),
                                                                     accepted));
        nsp.emit('eula', accepted);
        cb();
      },
    ])
  }

  function broadcast_icon() {
    // function to encode file data to base64 encoded string
    //http://www.hacksparrow.com/base64-encoding-decoding-in-node-js.html
    var fs = require('fs');
    var filepath = path.join(instance.env.cwd, 'server-icon.png');
    fs.readFile(filepath, function(err, data) {
      if (!err && data.toString('hex',0,4) == '89504e47') //magic number for png first 4B
        nsp.emit('server-icon.png', new Buffer(data).toString('base64'));
    });
  }

  function broadcast_cy() {
    // function to broadcast raw config.yml from bungeecord
    var fs = require('fs');
    var filepath = path.join(instance.env.cwd, 'config.yml');
    fs.readFile(filepath, function(err, data) {
      if (!err)
        nsp.emit('config.yml', new Buffer(data).toString());
    });
  }

  function broadcast_notices() {
    nsp.emit('notices', notices);
  }

  function broadcast_sp() {
    instance.sp(function(err, sp_data) {
      logging.debug('[{0}] broadcasting server.properties'.format(server_name));
      nsp.emit('server.properties', sp_data);
    })
  }

  function broadcast_sc() {
    instance.sc(function(err, sc_data) {
      logging.debug('[{0}] broadcasting server.config'.format(server_name));
      if (!err)
        nsp.emit('server.config', sc_data);
    })
  }

  function broadcast_cc() {
    instance.crons(function(err, cc_data) {
      logging.debug('[{0}] broadcasting cron.config'.format(server_name));
      if (!err)
        nsp.emit('cron.config', cc_data);
    })
  }

  function make_tail(rel_filepath) {
    /* makes a file tail relative to the CWD, e.g., /var/games/minecraft/servers/myserver.
       tails are used to get live-event reads on files.
       if the server does not exist, a watch is made in the interim, waiting for its creation.  
       once the watch is satisfied, the watch is closed and a tail is finally created.
    */
    var tail = require('tail').Tail;
    var abs_filepath = path.join(instance.env.cwd, rel_filepath);

    if (rel_filepath in tails) {
      logging.warn('[{0}] Tail already exists for {1}'.format(server_name, rel_filepath));
      return;
    }

    try {
      var new_tail = new tail(abs_filepath);
      logging.info('[{0}] Created tail on {1}'.format(server_name, rel_filepath));
      new_tail.on('line', function(data) {
        //logging.info('[{0}] {1}: transmitting new tail data'.format(server_name, rel_filepath));
        nsp.emit('tail_data', {'filepath': rel_filepath, 'payload': data});
      })
      tails[rel_filepath] = new_tail;
    } catch (e) {
      logging.error('[{0}] Create tail on {1} failed'.format(server_name, rel_filepath));
      logging.info('[{0}] Watching for file generation: {1}'.format(server_name, rel_filepath));
      
      var fireworm = require('fireworm');
      var fw = fireworm(instance.env.cwd);

      fw.add('**/{0}'.format(rel_filepath));
      fw.on('add', function(fp) {
        fw.clear();
        logging.info('[{0}] {1} created! Watchfile {2} closed'.format(server_name, path.basename(fp), rel_filepath));
        make_tail(rel_filepath);
      })
    }
  }

  nsp.on('connection', function(socket) {
    var ip_address = socket.request.connection.remoteAddress;
    var username = socket.request.user.username;
    var NOTICES_QUEUE_LENGTH = 10; // 0 < q <= 10

    function server_dispatcher(args) {
      var introspect = require('introspect');
      var fn, required_args;
      var arg_array = [];

      try {
        fn = instance[args.command];
        required_args = introspect(fn);
        // receives an array of all expected arguments, using introspection.
        // they are in order as listed by the function definition, which makes iteration possible.
      } catch (e) { 
        args.success = false;
        args.error = e;
        args.time_resolved = Date.now();
        nsp.emit('server_fin', args);
        logging.error('server_fin', args);
        
        while (notices.length > NOTICES_QUEUE_LENGTH)
          notices.shift();
        notices.push(args);
        return;
      }

      for (var i in required_args) {
        // all callbacks expected to follow the pattern (success, payload).
        if (required_args[i] == 'callback') 
          arg_array.push(function(err, payload) {
            args.success = !err;
            args.err = err;
            args.time_resolved = Date.now();
            nsp.emit('server_fin', args);
            if (err)
              logging.error('[{0}] command "{1}" errored out:'.format(server_name, args.command), args);
            logging.log('server_fin', args)

            while (notices.length > NOTICES_QUEUE_LENGTH)
              notices.shift();

            if (args.command != 'delete')
              notices.push(args);
          })
        else if (required_args[i] in args) {
          arg_array.push(args[required_args[i]])
        } else {
          args.success = false;
          logging.error('Provided values missing required argument', required_args[i]);
          args.error = 'Provided values missing required argument: {0}'.format(required_args[i]);
          nsp.emit('server_fin', args);
          return;
        }
      }

      if (args.command == 'delete')
        self.cleanup();

      logging.info('[{0}] received request "{1}"'.format(server_name, args.command))
      fn.apply(instance, arg_array);
    }

    function produce_receipt(args) {
      /* when a command is received, immediately respond to client it has been received */
      var uuid = require('node-uuid');
      logging.info('[{0}] {1} issued command : "{2}"'.format(server_name, ip_address, args.command))
      args.uuid = uuid.v1();
      args.time_initiated = Date.now();
      nsp.emit('server_ack', args);

      switch (args.command) {
        case 'chown':
          async.waterfall([
            async.apply(instance.property, 'owner'),
            function(owner_data, cb) {
              if (owner_data.username != username)
                cb('Only the current user owner may reassign server ownership.');
              else if (owner_data.uid != args.uid)
                cb('You may not change the user owner of the server.');
              else
                cb();
            }
          ], function(err) {
            if (err) {
              args.success = false;
              args.err = err;
              args.time_resolved = Date.now();
              logging.error('[{0}] command "{1}" errored out:'.format(server_name, args.command), args);
              nsp.emit('server_fin', args);
            } else {
              server_dispatcher(args);
            }
          })
          break;
        default:
          server_dispatcher(args);
          break;
      }
      
    }

    function get_file_contents(rel_filepath) {
      if (rel_filepath in tails) { //this is the protection from malicious client
        // a tail would only exist for a file the server itself has opened
        var fs = require('fs');
        var abs_filepath = path.join(instance.env['cwd'], rel_filepath);
        var FILESIZE_LIMIT_THRESHOLD = 256000;

        async.waterfall([
          async.apply(fs.stat, abs_filepath),
          function(stat_data, cb) {
            cb(stat_data.size > FILESIZE_LIMIT_THRESHOLD)
          },
          async.apply(fs.readFile, abs_filepath),
          function(data, cb) {
            logging.info('[{0}] transmittting existing file contents: {1} ({2} bytes)'.format(server_name, rel_filepath, data.length));
            nsp.emit('file head', {filename: rel_filepath, payload: data.toString()});
            cb();
          }
        ], function(err) {
          if (err) {
            var msg = "File is too large (> {0} KB).  Only newly added lines will appear here.".format(FILESIZE_LIMIT_THRESHOLD/1000);
            nsp.emit('file head', {filename: rel_filepath, payload: msg });
          }
        })
      }
    }

    function get_prop(requested) {
      logging.info('[{0}] {1} requesting property: {2}'.format(server_name, ip_address, requested.property));
      instance.property(requested.property, function(err, retval) {
        logging.info('[{0}] returned to {1}: {2}'.format(server_name, ip_address, retval));
        nsp.emit('server_fin', {'server_name': server_name, 'property': requested.property, 'payload': retval});
      })
    }

    function get_page_data(page) {
      switch (page) {
        case 'glance':
          logging.debug('[{0}] {1} requesting server at a glance info'.format(server_name, username));

          async.parallel({
            'increments': async.apply(instance.list_increments),
            'archives': async.apply(instance.list_archives),
            'du_awd': async.apply(instance.property, 'du_awd'),
            'du_bwd': async.apply(instance.property, 'du_bwd'),
            'du_cwd': async.apply(instance.property, 'du_cwd'),
            'owner': async.apply(instance.property, 'owner'),
            'server_files': async.apply(instance.property, 'server_files'),
            'eula': async.apply(instance.property, 'eula'),
            'base_dir': function(cb) {
              cb(null, base_dir)
            }
          }, function(err, results) {
            if (err instanceof Object)
              logging.error('[{0}] Error with get_page_data'.format(server_name), err, results);
            nsp.emit('page_data', {page: page, payload: results});
          })
          break;
        default:
          nsp.emit('page_data', {page: page});
          break;
      }
    }

    function manage_cron(opts) {
      var uuid = require('node-uuid');
      var hash = require('object-hash');
      var CronJob = require('cron').CronJob;

      function reload_cron(callback) {
        for (var c in cron) {
          try {
            cron[c].stop();
          } catch (e) {}
        }
        cron = {};

        instance.crons(function(err, cron_dict) {
          for (var cronhash in cron_dict) {
            if (cron_dict[cronhash].enabled) {
              try {
                cron[cronhash] = new CronJob({
                  cronTime: cron_dict[cronhash].source,
                  onTick: function() {
                    server_dispatcher(this);
                  },
                  start: true,
                  context: cron_dict[cronhash]
                });
              } catch (e) {
                //catches invalid cron pattern, disables cron
                logging.warn('[{0}] {1} invalid cron expression submitted:'.format(server_name, ip_address), cron_dict[cronhash].source);
                instance.set_cron(opts.hash, false, function(){});
              }
            }
          }
          callback();
        })
      }

      var operation = opts.operation;
      delete opts.operation;

      switch (operation) {
        case 'create':
          var cron_hash = hash(opts);
          logging.log('[{0}] {1} requests cron creation:'.format(server_name, ip_address), cron_hash, opts);

          opts['enabled'] = false;

          async.series([
            async.apply(instance.add_cron, cron_hash, opts),
            async.apply(reload_cron)
          ])
          break;
        case 'delete':
          logging.log('[{0}] {1} requests cron deletion: {2}'.format(server_name, ip_address, opts.hash));

          try {
            cron[opts.hash].stop();
          } catch (e) {}

          try {
            delete cron[opts.hash];
          } catch (e) {}

          async.series([
            async.apply(instance.delete_cron, opts.hash),
            async.apply(reload_cron)
          ])
          break;
        case 'start':
          logging.log('[{0}] {1} starting cron: {2}'.format(server_name, ip_address, opts.hash));
          
          async.series([
            async.apply(instance.set_cron, opts.hash, true),
            async.apply(reload_cron)
          ])
          break;
        case 'suspend':
          logging.log('[{0}] {1} suspending cron: {2}'.format(server_name, ip_address, opts.hash));

          async.series([
            async.apply(instance.set_cron, opts.hash, false),
            async.apply(reload_cron)
          ])
          break;
        default:
          logging.warn('[{0}] {1} requested unexpected cron operation: {2}'.format(server_name, ip_address, operation), opts);
      }
    }

    async.waterfall([
      async.apply(instance.property, 'owner'),
      function(ownership_data, cb) {
        var auth = require('./auth');
        auth.test_membership(username, ownership_data.groupname, function(is_valid) {
          cb(null, is_valid);
        });
      },
      function(is_valid, cb) {
        cb(!is_valid); //logical NOT'ted:  is_valid ? falsy error, !is_valid ? truthy error
      }
    ], function(err) {
      if (err)
        socket.disconnect();
      else {
        logging.info('[{0}] {1} ({2}) joined server namespace'.format(server_name, username, ip_address));

        socket.on('command', produce_receipt);
        socket.on('get_file_contents', get_file_contents);
        socket.on('property', get_prop);
        socket.on('page_data', get_page_data);
        socket.on('cron', manage_cron);
        socket.on('server.properties', broadcast_sp);
        socket.on('server.config', broadcast_sc);
        socket.on('cron.config', broadcast_cc);
        socket.on('server-icon.png', broadcast_icon);
        socket.on('config.yml', broadcast_cy);
        socket.on('req_server_activity', broadcast_notices);
      }
    })

  }) //nsp on connect container ends
}



function check_profiles(base_dir, callback) {
  /**
   * Returns list of all available profiles and denotes which are present on the system
   * @param {String} base_dir, likely /var/games/minecraft
   * @return {Array} all profile definitions
   */
  var self = this;
  var request = require('request');
  var fs = require('fs');

  function profile_template() {
    return  {
      id: null,
      time: null,
      releaseTime: null,
      type: null, // release, snapshot, old_version
      group: null, //mojang, ftb, ftb_third_party, pocketmine, etc.
      webui_desc: null, 
      weight: 0,
      downloaded: false,
      filename: null, // minecraft_server.1.8.8.jar
      version: null // 1.8.8,
    }
  }

  var SOURCES = {
    mojang: function(callback) {
      var MOJANG_VERSIONS_URL = 'http://s3.amazonaws.com/Minecraft.Download/versions/versions.json';
      var path_prefix = path.join(base_dir, mineos.DIRS['profiles']);

      function handle_reply(err, response, body) {
        var p = [];

        if (!err && (response || {}).statusCode === 200)
          for (var index in body.versions) {
            var item = new profile_template();
            var ref_obj = body.versions[index];

            item['id'] = ref_obj['id'];
            item['time'] = ref_obj['time'];
            item['releaseTime'] = ref_obj['releaseTime'];
            item['type'] = ref_obj['type'];
            item['group'] = 'mojang';
            item['webui_desc'] = 'Official Mojang Jar';
            item['weight'] = 0;
            item['filename'] = 'minecraft_server.{0}.jar'.format(ref_obj['id']);
            item['downloaded'] = fs.existsSync(path.join(base_dir, mineos.DIRS['profiles'], item.id, item.filename));
            item['version'] = ref_obj['id'];
            item['release_version'] = ref_obj['id'];
            item['url'] = 'https://s3.amazonaws.com/Minecraft.Download/versions/{0}/minecraft_server.{0}.jar'.format(item.version);

            p.push(item);
          }

        callback(err, p);
      }
      request({ url: MOJANG_VERSIONS_URL, json: true }, handle_reply);
    },
    ftb: function(callback) {
      var xml_parser = require('xml2js');

      var FTB_VERSIONS_URL = 'http://ftb.cursecdn.com/FTB2/static/modpacks.xml';
      var path_prefix = path.join(base_dir, mineos.DIRS['profiles']);

      function handle_reply(err, response, body) {
        var p = [];

        if (!err && (response || {}).statusCode === 200)
          xml_parser.parseString(body, function(inner_err, result) {
            try {
              var packs = result['modpacks']['modpack'];

              for (var index in packs) {
                var item = new profile_template();
                var ref_obj = packs[index]['$'];

                item['id'] = '{0}-{1}'.format(ref_obj['dir'], ref_obj['version']);
                //item['time'] = ref_obj['time'];
                //item['releaseTime'] = ref_obj['releaseTime'];
                item['type'] = 'release';
                item['group'] = 'ftb';
                item['webui_desc'] = '{0} (mc: {1})'.format(ref_obj['name'], ref_obj['mcVersion']);
                item['weight'] = 3;
                item['filename'] = ref_obj['serverPack'];
                item['url'] = 'http://ftb.cursecdn.com/FTB2/modpacks/{0}/{1}/{2}'.format(ref_obj.dir, ref_obj.version.replace(/\./g, '_'), ref_obj.serverPack);
                item['downloaded'] = fs.existsSync(path.join(base_dir, mineos.DIRS['profiles'], item.id, item.filename));
                item['version'] = ref_obj['mcVersion'];
                item['release_version'] = ref_obj['version'];
                p.push(item);

                var old_versions = ref_obj['oldVersions'].split(';');
                for (var idx in old_versions) {
                  var new_item = new profile_template();

                  new_item['id'] = '{0}-{1}'.format(ref_obj['dir'], old_versions[idx]);
                  //new_item['time'] = ref_obj['time'];
                  //new_item['releaseTime'] = ref_obj['releaseTime'];
                  new_item['type'] = 'old_version';
                  new_item['group'] = 'ftb';
                  new_item['webui_desc'] = ref_obj['name'];
                  new_item['weight'] = 3;
                  new_item['filename'] = ref_obj['serverPack'];
                  new_item['url'] = 'http://ftb.cursecdn.com/FTB2/modpacks/{0}/{1}/{2}'.format(ref_obj.dir, ref_obj.version.replace(/\./g, '_'), ref_obj.serverPack);
                  new_item['downloaded'] = fs.existsSync(path.join(base_dir, mineos.DIRS['profiles'], new_item.id, new_item.filename));
                  new_item['version'] = ref_obj['mcVersion'];
                  new_item['release_version'] = old_versions[idx];

                  if (old_versions[idx].length > 0 && old_versions[idx] != ref_obj['version'])
                    p.push(new_item);                  
                }
              }
              callback(err || inner_err, p);
            } catch (e) {
              callback(e, p)
            }
          })
        else
          callback(null, p);
      }
      request({ url: FTB_VERSIONS_URL, json: false }, handle_reply);
    },
    ftb_third_party: function(callback) {
      var xml_parser = require('xml2js');

      var FTB_VERSIONS_URL = 'http://ftb.cursecdn.com/FTB2/static/thirdparty.xml';
      var path_prefix = path.join(base_dir, mineos.DIRS['profiles']);

      function handle_reply(err, response, body) {
        var p = [];

        if (!err && (response || {}).statusCode === 200)
          xml_parser.parseString(body, function(inner_err, result) {
            try {
              var packs = result['modpacks']['modpack'];

              for (var index in packs) {
                var item = new profile_template();
                var ref_obj = packs[index]['$'];

                item['id'] = '{0}-{1}'.format(ref_obj['dir'], ref_obj['version']);
                //item['time'] = ref_obj['time'];
                //item['releaseTime'] = ref_obj['releaseTime'];
                item['type'] = 'release';
                item['group'] = 'ftb_third_party';
                item['webui_desc'] = '{0} (mc: {1})'.format(ref_obj['name'], ref_obj['mcVersion']);
                item['weight'] = 3;
                item['filename'] = ref_obj['serverPack'];
                item['url'] = 'http://ftb.cursecdn.com/FTB2/modpacks/{0}/{1}/{2}'.format(ref_obj.dir, ref_obj.version.replace(/\./g, '_'), ref_obj.serverPack);
                item['downloaded'] = fs.existsSync(path.join(base_dir, mineos.DIRS['profiles'], item.id, item.filename));
                item['version'] = ref_obj['mcVersion'];
                item['release_version'] = ref_obj['version'];
                p.push(item);

                var old_versions = ref_obj['oldVersions'].split(';');
                for (var idx in old_versions) {
                  var new_item = new profile_template();

                  new_item['id'] = '{0}-{1}'.format(ref_obj['dir'], old_versions[idx]);
                  //new_item['time'] = ref_obj['time'];
                  //new_item['releaseTime'] = ref_obj['releaseTime'];
                  new_item['type'] = 'old_version';
                  new_item['group'] = 'ftb';
                  new_item['webui_desc'] = ref_obj['name'];
                  new_item['weight'] = 3;
                  new_item['filename'] = ref_obj['serverPack'];
                  new_item['url'] = 'http://ftb.cursecdn.com/FTB2/modpacks/{0}/{1}/{2}'.format(ref_obj.dir, ref_obj.version.replace(/\./g, '_'), ref_obj.serverPack);
                  new_item['downloaded'] = fs.existsSync(path.join(base_dir, mineos.DIRS['profiles'], new_item.id, new_item.filename));
                  new_item['version'] = ref_obj['mcVersion'];
                  new_item['release_version'] = old_versions[idx];

                  if (old_versions[idx].length > 0 && old_versions[idx] != ref_obj['version'])
                    p.push(new_item);                  
                }
              }
              callback(err || inner_err, p);
            } catch (e) {
              callback(e, p)
            }
          })
        else
          callback(null, p);
      }
      request({ url: FTB_VERSIONS_URL, json: false }, handle_reply);
    },
    forge: function(callback) {
      var FORGE_VERSIONS_URL = 'http://files.minecraftforge.net/maven/net/minecraftforge/forge/promotions.json';
      var path_prefix = path.join(base_dir, mineos.DIRS['profiles']);

      function handle_reply(err, response, body) {
        var p = [];

        if (!err && (response || {}).statusCode === 200)
          for (var index in body.promos) {
            var item = new profile_template();
            var ref_obj = body.promos[index];

            item['id'] = index;
            item['time'] = ref_obj['modified'];
            item['releaseTime'] = ref_obj['modified'];
            item['type'] = 'release';
            item['group'] = 'forge';
            item['webui_desc'] = 'Forge Jar (build {0})'.format(ref_obj['build']);
            item['weight'] = 0;
            item['filename'] = 'forge-{0}-{1}-installer.jar'.format(ref_obj['mcversion'], ref_obj['version']);
            item['downloaded'] = fs.existsSync(path.join(base_dir, mineos.DIRS['profiles'], item.id, item.filename));
            item['version'] = ref_obj['mcversion'];
            item['release_version'] = ref_obj['version'];
            item['url'] = 'http://files.minecraftforge.net/maven/net/minecraftforge/forge/{0}-{1}/{2}'.format(ref_obj['mcversion'], ref_obj['version'], item['filename']);

            if (parseFloat(ref_obj['mcversion']) > 1.6)
              p.push(item);
          }

        callback(err, p);
      }
      request({ url: FORGE_VERSIONS_URL, json: true }, handle_reply);
    },
    /*spigot_buildtools: function(callback) {
      var xml_parser = require('xml2js');
      var SPIGOT_VERSIONS_URL = 'https://hub.spigotmc.org/jenkins/job/BuildTools/rssAll';
      var path_prefix = path.join(base_dir, mineos.DIRS['profiles']);
      function handle_reply(err, response, body) {
        var p = [];
        if (!err && (response || {}).statusCode === 200)
          xml_parser.parseString(body, function(inner_err, result) {
            for (var index in result.feed.entry) {
              var item = new profile_template();
              var ref_obj = result.feed.entry[index];
              var num = ref_obj.title[0].match(/\#(\d+)/)[1];
              item['id'] = 'BuildTools-{0}'.format(num);
              item['time'] = new Date(ref_obj.updated[0]).getTime();
              item['releaseTime'] = new Date(ref_obj.published[0]).getTime();
              item['type'] = 'release';
              item['group'] = 'spigot_buildtools';
              item['webui_desc'] = ref_obj.title[0];
              item['weight'] = 0;
              item['filename'] = 'BuildTools.jar';
              item['downloaded'] = fs.existsSync(path.join(base_dir, mineos.DIRS['profiles'], item.id, item.filename));
              item['version'] = num;
              item['release_version'] = '';
              item['url'] = 'https://hub.spigotmc.org/jenkins/job/BuildTools/{0}/artifact/target/BuildTools.jar'.format(num);
              p.push(item);
            }
            callback(err || inner_err, p);
          })
        else
          callback(null, p);
      }
      request({ url: SPIGOT_VERSIONS_URL, json: false }, handle_reply);
    },*/
    spigot_buildtools: function(callback) {
      var p = [];

      var item = {};

      item['id'] = 'BuildTools-latest';
      item['time'] = new Date().getTime();
      item['releaseTime'] = new Date().getTime();
      item['type'] = 'release';
      item['group'] = 'spigot_buildtools';
      item['webui_desc'] = 'Latest BuildTools.jar for building Spigot/Craftbukkit';
      item['weight'] = 0;
      item['filename'] = 'BuildTools.jar';
      item['downloaded'] = fs.existsSync(path.join(base_dir, mineos.DIRS['profiles'], item.id, item.filename));
      item['version'] = 0;
      item['release_version'] = '';
      item['url'] = 'https://hub.spigotmc.org/jenkins/job/BuildTools/lastSuccessfulBuild/artifact/target/BuildTools.jar';

      p.push(item);

      callback(null, p);
    },
    pocketmine: function(callback) {
      var URL_DEVELOPMENT = "http://www.pocketmine.net/api/?channel=development";
      var URL_STABLE = "http://www.pocketmine.net/api/?channel=stable";

      var p = [];

      function handle_reply(err, retval) {
        for (var r in retval) 
          if ((retval[r] || {}).statusCode == 200) {
            var item = new profile_template();
            var ref_obj = JSON.parse(retval[r].body);

            item['id'] = 'PocketMine-{0}'.format(ref_obj['build']);
            item['time'] = ref_obj['date'];
            item['releaseTime'] = ref_obj['date'];
            //item['type'] = 'release';
            item['group'] = 'pocketmine';
            item['webui_desc'] = '{0} (api: {1})'.format(ref_obj['version'], ref_obj['api_version']);
            item['weight'] = 10;
            item['channel'] = r;
            item['filename'] = path.basename(ref_obj['download_url']);
            item['url'] = ref_obj['download_url'];
            item['downloaded'] = fs.existsSync(path.join(base_dir, mineos.DIRS['profiles'], item.id, item.filename));
            item['version'] = null;
            item['release_version'] = ref_obj['build'];

            switch (r) {
              case 'stable':
                item['type'] = 'release';
                break;
              case 'development':
                item['type'] = 'snapshot';
                break;
            }

            p.push(item);
          }
        callback(null, p)
      }

      async.auto({
        'stable': async.retry(2, async.apply(request, URL_STABLE)),
        'development': async.retry(2, async.apply(request, URL_DEVELOPMENT)),
      }, handle_reply)
    },
    php: function(callback) {
      BUILD_REGEX = /^[\w]+BUILD="([^"]+)"/
      var p = [];

      function handle_reply(err, response, body) {
        if (!err && (response || {}).statusCode == 200) {
          var lines = body.split('\n');
          for (var i in lines) {
            var matching = lines[i].match(BUILD_REGEX);
            if (matching) {
              var item = new profile_template();
              item['group'] = 'php';
              item['type'] = 'release';
              item['id'] = matching[1];
              item['webui_desc'] = 'PHP binary for Pocketmine';
              item['weight'] = 12;
              item['downloaded'] = fs.existsSync(path.join(base_dir, mineos.DIRS['profiles'], matching[1], '{0}.tar.gz'.format(matching[1])));
              item['filename'] = '{0}.tar.gz'.format(matching[1]);
              item['url'] = 'https://dl.bintray.com/pocketmine/PocketMine/{0}'.format(item.filename);
              p.push(item);
            }
          }
        }
        callback(err, p);
      }
      request('http://get.pocketmine.net', handle_reply);
    },
    bungeecord: function(callback) {
      var xml_parser = require('xml2js');

      var BUNGEE_VERSIONS_URL = 'http://ci.md-5.net/job/BungeeCord/rssAll';
      var path_prefix = path.join(base_dir, mineos.DIRS['profiles']);

      function handle_reply(err, response, body) {
        var p = [];

        if (!err && (response || {}).statusCode === 200)
          xml_parser.parseString(body, function(inner_err, result) {
            try {
              var packs = result['feed']['entry'];

              for (var index in packs) {
                var item = new profile_template();
                var ref_obj = packs[index];

                item['version'] = packs[index]['id'][0].split(':').slice(-1)[0];
                item['group'] = 'bungeecord';
                item['type'] = 'release';
                item['id'] = 'BungeeCord-{0}'.format(item.version);
                item['webui_desc'] = packs[index]['title'][0];
                item['weight'] = 5;
                item['filename'] = 'BungeeCord-{0}.jar'.format(item.version);
                item['downloaded'] = fs.existsSync(path.join(base_dir, mineos.DIRS['profiles'], item.id, item.filename));
                item['url'] = 'http://ci.md-5.net/job/BungeeCord/{0}/artifact/bootstrap/target/BungeeCord.jar'.format(item.version);
                p.push(item);
              }
              callback(err || inner_err, p);
            } catch (e) {
              callback(e, p)
            }
          })
        else
          callback(null, p);
      }
      request({ url: BUNGEE_VERSIONS_URL, json: false }, handle_reply);
    }
  } //end sources

  logging.info('[WEBUI] Downloading official profiles.');

  var LIMIT_SIMULTANEOUS_DOWNLOADS = 3;
  var results = {};

  async.forEachOfLimit(
    SOURCES, 
    LIMIT_SIMULTANEOUS_DOWNLOADS, 
    function(dl_func, key, inner_callback) {
      dl_func(function(err, profs) {
        for (var source in profs)
          results[key] = profs;

        inner_callback();
      })
    }, 
    function(err) {
      var merged = [];
      for (var source in results)
        merged = merged.concat.apply(merged, results[source]);

      callback(err, merged);
    }
  )

} // end check_profiles

function download_profiles(base_dir, args, progress_update_fn, callback) {
  var request = require('request');
  var progress = require('request-progress');

  args['command'] = 'Download';

  var DOWNLOADS = {
    mojang: function(inner_callback) {
      var dest_dir = path.join(base_dir, 'profiles', args.id);
      var dest_filepath = path.join(dest_dir, args.filename);

      var url = args.url;

      fs.ensureDir(dest_dir, function(err) {
        if (err) {
          logging.error('[WEBUI] Error attempting download:', err);
        } else {
          progress(request(url), {
            throttle: 1000,
            delay: 100
          })
            .on('complete', function(response) {
              if (response.statusCode == 200) {
                logging.log('[WEBUI] Successfully downloaded {0} to {1}'.format(url, dest_filepath));
                args['dest_dir'] = dest_dir;
                args['success'] = true;
                args['progress']['percent'] = 100;
                args['help_text'] = 'Successfully downloaded {0} to {1}'.format(url, dest_filepath);
                args['suppress_popup'] = false;
                inner_callback(args);
              } else {
                logging.error('[WEBUI] Server was unable to download file:', url);
                logging.error('[WEBUI] Remote server returned status {0} with headers:'.format(response.statusCode), response.headers);
                args['success'] = false;
                args['help_text'] = 'Remote server did not return {0} (status {1})'.format(args.filename, response.statusCode);
                args['suppress_popup'] = false;
                inner_callback(args);
              }
            })
            .on('progress', function(state) {
              args['progress'] = state;
              progress_update_fn(args);
            })
            .pipe(fs.createWriteStream(dest_filepath))
        }
      });
    },
    ftb: function(inner_callback) {
      var unzip = require('unzip');

      var dest_dir = path.join(base_dir, 'profiles', args.id);
      var dest_filepath = path.join(dest_dir, args.filename);

      var url = args.url;

      fs.ensureDir(dest_dir, function(err) {
        if (err) {
          logging.error('[WEBUI] Error attempting download:', err);
        } else {
          progress(request(url), {
            throttle: 1000,
            delay: 100
          })
            .on('complete', function(response) {
              if (response.statusCode == 200) {
                logging.log('[WEBUI] Successfully downloaded {0} to {1}'.format(url, dest_filepath));
                args['dest_dir'] = dest_dir;
                args['success'] = true;
                args['help_text'] = 'Successfully downloaded {0} to {1}'.format(url, dest_filepath);

                fs.createReadStream(dest_filepath)
                  .pipe(unzip.Extract({ path: dest_dir }).on('close', function() {
                    inner_callback(args);
                  }));
              } else {
                logging.error('[WEBUI] Server was unable to download file:', url);
                logging.error('[WEBUI] Remote server returned status {0} with headers:'.format(response.statusCode), response.headers);
                args['success'] = false;
                args['help_text'] = 'Remote server did not return {0} (status {1})'.format(args.filename, response.statusCode);
                inner_callback(args);
              }
            })
            .on('progress', function(state) {
              args['progress'] = state;
              progress_update_fn(args);
            })
            .pipe(fs.createWriteStream(dest_filepath))
        }
      });
    },
    ftb_third_party: function(inner_callback) {
      var unzip = require('unzip');

      var dest_dir = path.join(base_dir, 'profiles', args.id);
      var dest_filepath = path.join(dest_dir, args.filename);

      var url = args.url;

      fs.ensureDir(dest_dir, function(err) {
        if (err) {
          logging.error('[WEBUI] Error attempting download:', err);
        } else {
          progress(request(url), {
            throttle: 1000,
            delay: 100
          })
            .on('complete', function(response) {
              if (response.statusCode == 200) {
                logging.log('[WEBUI] Successfully downloaded {0} to {1}'.format(url, dest_filepath));
                args['dest_dir'] = dest_dir;
                args['success'] = true;
                args['help_text'] = 'Successfully downloaded {0} to {1}'.format(url, dest_filepath);

                fs.createReadStream(dest_filepath)
                  .pipe(unzip.Extract({ path: dest_dir }).on('close', function() {
                    inner_callback(args);
                  }));
              } else {
                logging.error('[WEBUI] Server was unable to download file:', url);
                logging.error('[WEBUI] Remote server returned status {0} with headers:'.format(response.statusCode), response.headers);
                args['success'] = false;
                args['help_text'] = 'Remote server did not return {0} (status {1})'.format(args.filename, response.statusCode);
                inner_callback(args);
              }
            })
            .on('progress', function(state) {
              args['progress'] = state;
              progress_update_fn(args);
            })
            .pipe(fs.createWriteStream(dest_filepath))
        }
      });
    },
    forge: function(inner_callback) {
      var dest_dir = path.join(base_dir, 'profiles', args.id);
      var dest_filepath = path.join(dest_dir, args.filename);

      var url = args.url;

      fs.ensureDir(dest_dir, function(err) {
        if (err) {
          logging.error('[WEBUI] Error attempting download:', err);
        } else {
          progress(request(url), {
            throttle: 1000,
            delay: 100
          })
            .on('complete', function(response) {
              if (response.statusCode == 200) {
                logging.log('[WEBUI] Successfully downloaded {0} to {1}'.format(url, dest_filepath));
                args['dest_dir'] = dest_dir;
                args['success'] = true;
                args['progress']['percent'] = 100;
                args['help_text'] = 'Successfully downloaded {0} to {1}'.format(url, dest_filepath);
                args['suppress_popup'] = false;
                inner_callback(args);
              } else {
                logging.error('[WEBUI] Server was unable to download file:', url);
                logging.error('[WEBUI] Remote server returned status {0} with headers:'.format(response.statusCode), response.headers);
                args['success'] = false;
                args['help_text'] = 'Remote server did not return {0} (status {1})'.format(args.filename, response.statusCode);
                args['suppress_popup'] = false;
                inner_callback(args);
              }
            })
            .on('progress', function(state) {
              args['progress'] = state;
              progress_update_fn(args);
            })
            .pipe(fs.createWriteStream(dest_filepath))
        }
      });
    },
    spigot_buildtools: function(inner_callback) {
      var dest_dir = path.join(base_dir, 'profiles', args.id);
      var dest_filepath = path.join(dest_dir, args.filename);

      var url = args.url;

      fs.ensureDir(dest_dir, function(err) {
        if (err) {
          logging.error('[WEBUI] Error attempting download:', err);
        } else {
          progress(request(url), {
            throttle: 1000,
            delay: 100
          })
            .on('complete', function(response) {
              if (response.statusCode == 200) {
                logging.log('[WEBUI] Successfully downloaded {0} to {1}'.format(url, dest_filepath));
                args['dest_dir'] = dest_dir;
                args['success'] = true;
                args['progress']['percent'] = 100;
                args['help_text'] = 'Successfully downloaded {0} to {1}'.format(url, dest_filepath);
                args['suppress_popup'] = false;
                inner_callback(args);
              } else {
                logging.error('[WEBUI] Server was unable to download file:', url);
                logging.error('[WEBUI] Remote server returned status {0} with headers:'.format(response.statusCode), response.headers);
                args['success'] = false;
                args['help_text'] = 'Remote server did not return {0} (status {1})'.format(args.filename, response.statusCode);
                args['suppress_popup'] = false;
                inner_callback(args);
              }
            })
            .on('progress', function(state) {
              args['progress'] = state;
              progress_update_fn(args);
            })
            .pipe(fs.createWriteStream(dest_filepath))
        }
      });
    },
    pocketmine: function(inner_callback) {
      var dest_dir = path.join(base_dir, 'profiles', args.id);
      var dest_filepath = path.join(dest_dir, args.filename);

      var url = args.url;

      fs.ensureDir(dest_dir, function(err) {
        if (err) {
          logging.error('[WEBUI] Error attempting download:', err);
        } else {
          progress(request(url), {
            throttle: 1000,
            delay: 100
          })
            .on('complete', function(response) {
              if (response.statusCode == 200) {
                logging.log('[WEBUI] Successfully downloaded {0} to {1}'.format(url, dest_filepath));
                args['dest_dir'] = dest_dir;
                args['success'] = true;
                args['help_text'] = 'Successfully downloaded {0} to {1}'.format(url, dest_filepath);
                inner_callback(args);
              } else {
                logging.error('[WEBUI] Server was unable to download file:', url);
                logging.error('[WEBUI] Remote server returned status {0} with headers:'.format(response.statusCode), response.headers);
                args['success'] = false;
                args['help_text'] = 'Remote server did not return {0} (status {1})'.format(args.filename, response.statusCode);
                inner_callback(args);
              }
            })
            .on('progress', function(state) {
              args['progress'] = state;
              progress_update_fn(args);
            })
            .pipe(fs.createWriteStream(dest_filepath))
        }
      });
    },
    php: function(inner_callback) {
      var tarball = require('tarball-extract')

      var dest_dir = path.join(base_dir, 'profiles', args.id);
      var dest_filepath = path.join(dest_dir, args.filename);

      var url = args.url;

      fs.ensureDir(dest_dir, function(err) {
        if (err) {
          logging.error('[WEBUI] Error attempting download:', err);
        } else {
          progress(request(url), {
            throttle: 1000,
            delay: 100
          })
            .on('complete', function(response) {
              if (response.statusCode == 200) {
                logging.log('[WEBUI] Successfully downloaded {0} to {1}'.format(url, dest_filepath));
                args['dest_dir'] = dest_dir;
                args['success'] = true;
                args['help_text'] = 'Successfully downloaded {0} to {1}'.format(url, dest_filepath);

                async.series([
                  async.apply(tarball.extractTarball, dest_filepath, dest_dir)
                ], function(err) {
                  if (err) {
                    args['success'] = false;
                    args['help_text'] = 'Successfully downloaded, but failed to extract {0}'.format(dest_filepath);
                    inner_callback(args);
                  } else {
                    inner_callback(args);
                  }
                })
              } else {
                logging.error('[WEBUI] Server was unable to download file:', url);
                logging.error('[WEBUI] Remote server returned status {0} with headers:'.format(response.statusCode), response.headers);
                args['success'] = false;
                args['help_text'] = 'Remote server did not return {0} (status {1})'.format(args.filename, response.statusCode);
                inner_callback(args);
              }
            })
            .on('progress', function(state) {
              args['progress'] = state;
              progress_update_fn(args);
            })
            .pipe(fs.createWriteStream(dest_filepath))
        }
      });
    },
    bungeecord: function(inner_callback) {
      var dest_dir = path.join(base_dir, 'profiles', args.id);
      var dest_filepath = path.join(dest_dir, args.filename);

      var url = args.url;

      fs.ensureDir(dest_dir, function(err) {
        if (err) {
          logging.error('[WEBUI] Error attempting download:', err);
        } else {
          progress(request(url), {
            throttle: 1000,
            delay: 100
          })
            .on('complete', function(response) {
              if (response.statusCode == 200) {
                logging.log('[WEBUI] Successfully downloaded {0} to {1}'.format(url, dest_filepath));
                args['dest_dir'] = dest_dir;
                args['success'] = true;
                args['progress']['percent'] = 100;
                args['help_text'] = 'Successfully downloaded {0} to {1}'.format(url, dest_filepath);
                args['suppress_popup'] = false;
                inner_callback(args);
              } else {
                logging.error('[WEBUI] Server was unable to download file:', url);
                logging.error('[WEBUI] Remote server returned status {0} with headers:'.format(response.statusCode), response.headers);
                args['success'] = false;
                args['help_text'] = 'Remote server did not return {0} (status {1})'.format(args.filename, response.statusCode);
                args['suppress_popup'] = false;
                inner_callback(args);
              }
            })
            .on('progress', function(state) {
              args['progress'] = state;
              progress_update_fn(args);
            })
            .pipe(fs.createWriteStream(dest_filepath))
        }
      });
    }
  } // end downloads {}

  DOWNLOADS[args.group](callback);

} //end function

{
  "name": "mineos-node",
  "description": "A Minecraft server manager and web user interface",
  "main": "mineos.js",
  "version": "1.1.1",
  "author": "William Dizon",
  "license": "GPL-3.0",
  "keywords": [
    "mineos",
    "minecraft"
  ],
  "repository": {
    "type": "git",
    "url": "https://github.com/hexparrot/mineos-node.git"
  },
  "bugs": {
    "url": "https://github.com/hexparrot/mineos-node/issues"
  },
  "homepage": "https://github.com/hexparrot/mineos-node",
  "dependencies": {
    "introspect": "0.0.x",
    "tail": "0.4.x",
    "node-uuid": "1.4.x",
    "fs-extra": "0.24.x",
    "async": "1.4.x",
    "which": "1.1.x",
    "ini": "1.3.x",
    "strftime": "0.9.x",
    "procfs-stats": "0.0.x",
    "whoami": "0.0.x",
    "userid": "0.2.x",
    "express": "3.5.x",
    "socket.io": "1.3.x",
    "du": "0.1.x",
    "body-parser": "1.14.x",
    "angular": "1.4.x",
    "moment": "2.10.x",
    "angular-moment": "0.10.x",
    "moment-duration-format": "1.3.x",
    "moment-timezone": "0.4.x",
    "angular-translate": "2.8.x",
    "cron": "1.0.x",
    "object-hash": "0.9.x",
    "tmp": "0.0.x",
    "request": "2.64.x",
    "rsync": "0.4.x",
    "etc-passwd": "0.1.x",
    "xml2js": "0.4.x",
    "unzip": "0.1.x",
    "line-by-line": "0.1.x",
    "passport": "0.3.x",
    "passport-local": "1.0.x",
    "passport.socketio": "3.6.x",
    "express-session": "1.11.x",
    "cookie-parser": "1.4.x",
    "method-override": "2.3.x",
    "q": "1.4.x",
    "sha512crypt-node": "0.1.x",
    "winston": "1.0.x",
    "urllib": "2.4.x",
    "daemonize2": "0.4.x",
    "tarball-extract": "0.0.3",
    "tar": "2.2.x",
    "decompress-zip": "0.2.x",
    "fireworm": "0.6.x",
    "request-progress": "0.3.x",
    "posix": "4.0.x",
    "apache-crypt": "1.0.x",
    "node-getopt": "0.2.x",
    "chownr": "1.0.x",
    "angular-sanitize": "1.4.x",
    "mcquery": "0.2.x"
  },
  "devDependencies": {
    "nodeunit": "0.9.x"
  }
}

#!/usr/bin/env node

var getopt = require('node-getopt');
var mineos = require('./mineos');

var opt = getopt.create([
  ['s' , 'server_name=SERVER_NAME'  , 'server name'],
  ['d' , 'base_dir=BASE_DIR'        , 'defaults to /var/games/minecraft'],
  ['D' , 'debug'                    , 'show debug output'],
  ['V' , 'version'                  , 'show version'],
  ['h' , 'help'                     , 'display this help']
])              // create Getopt instance
.bindHelp()     // bind option 'help' to default action
.parseSystem(); // parse command line

function return_git_commit_hash(callback) {
  var child_process = require('child_process');

  var gitproc = child_process.spawn('git', 'log -n 1 --pretty=format:"%H"'.split(' '));
  var commit_value = '';

  gitproc.stdout.on('data', function(data) {
    var buffer = new Buffer(data, 'ascii');
    commit_value = buffer.toString('ascii');
  });

  gitproc.on('error', function(code) {
    // branch if path does not exist
    if (code != 0)
      callback(true, undefined);
  });

  gitproc.on('exit', function(code) {
    if (code == 0) // branch if all is well
      callback(code, commit_value);
    else 
      callback(true, undefined);
  });
}

function handle_server(args, callback) {
  var introspect = require('introspect');

  var base_dir = (args.options || {}).d || '/var/games/minecraft';
  var command = args.argv.shift();
  var fn = instance[command];
  var arg_array = [];
  var required_args = introspect(fn);

  while (required_args.length) {
    var ra = required_args.shift();

    switch (ra) {
      case 'callback':
        arg_array.push(function(err, payload) {
          var retval = [];

          if (!err) {
            retval.push('[{0}] Successfully executed "{1}"'.format(args.options.server_name, command));
            if (payload)
              retval.push(payload)
          } else {
            retval.push('[{0}] Error executing "{1}" because server condition not met: {2}'.format(
              args.options.server_name, 
              command,
              err)
            );
          }

          callback( (err ? 1 : 0), retval );
        })
        break;
      case 'owner':
        try {
          var owner_pair = opt.argv.shift().split(':');
          if (owner_pair.length != 2)
            throw 'err';
          arg_array.push({
            uid: parseInt(owner_pair[0]),
            gid: parseInt(owner_pair[1])
          })
        } catch (e) {
          callback(1, ['Provide owner attribute as uid:gid pair, e.g., 1000:1000']);
          return;
        } 
        break;
      default:
        arg_array.push(opt.argv.shift())
        break;
    } //end switch
  } //end while

  fn.apply(instance, arg_array); //actually run the function with the args
}

function retrieve_property(args, callback) {
  var property = args.argv.shift();
  var fn = instance.property;
  var arg_array = [property];
  var retval = [];

  arg_array.push(function(err, payload) {
    if (!err && payload !== undefined) {
      retval.push('[{0}] Queried property: "{1}"'.format(args.options.server_name, property));
      retval.push(payload);
    } else {
      retval.push('[{0}] Error querying property "{1}"'.format(
        args.options.server_name, 
        property,
        err));
    }
    callback( (err ? 1 : 0), retval);
  })

  fn.apply(instance, arg_array);
}

var base_dir = (opt.options || {}).d || '/var/games/minecraft';
var instance = new mineos.mc(opt.options.server_name, base_dir);

if ('version' in opt.options) {
  return_git_commit_hash(function(code, hash) {
    if (!code)
      console.log(hash);
    process.exit(code);
  })
} else if (opt.argv[0] in instance) { //first provided param matches a function name) {
  handle_server(opt, function(code, retval) {
    for (var idx in retval)
      console.log(retval[idx])
    process.exit(code);
  })
} else {
  retrieve_property(opt, function(code, retval) {
    for (var idx in retval)
      console.log(retval[idx])
    process.exit(code);
  })
}

String.prototype.format = function() {
  var s = this;
  for(var i = 0, iL = arguments.length; i<iL; i++) {
    s = s.replace(new RegExp('\\{'+i+'\\}', 'gm'), arguments[i]);
  }
  return s;
};
use_https = true
socket_host = '0.0.0.0'
socket_port = 8443
base_directory = '/var/games/minecraft'

ssl_private_key = '/etc/ssl/certs/mineos.key'
ssl_certificate = '/etc/ssl/certs/mineos.crt'
ssl_cert_chain = ''
#!/bin/sh
# Generate SSL certificate
# Note: daemons using certificate need to be restarted for changes to take effect

fatal() {
    echo "fatal: $@" 1>&2
    exit 1
}

# Exit if openssl is not available
which openssl >/dev/null || fatal "openssl is not installed"

if [ $# -ne "0" ]; then
    HELP=y
fi

set ${O:="TurnKey Linux"}
set ${OU:="Software appliances"}

set ${DAYS:=3650}
set ${BITS:=1024}
set ${KEYPASS:=<blank>}           # workaround: no way of passing a blank pass
set ${CERTFILE:="/etc/ssl/certs/mineos.pem"}
set ${CRTFILE:="/etc/ssl/certs/mineos.crt"}
set ${KEYFILE:="/etc/ssl/certs/mineos.key"}

if [ $HELP ]; then
    echo "Generate SSL certificate"
    echo
    echo "# VARIABLE      EXPLANATION          [VALUE]"
    echo "  C             Country Code         $C"
    echo "  ST            State or province    $ST"
    echo "  L             Locality (city)      $L"
    echo "  O             Organization name    $O"
    echo "  OU            Organizational unit  $OU"
    echo "  CN            Common name          $CN"
    echo "  emailAddress  Email address        $emailAddress"
    echo
    echo "  DAYS          Duration in days     $DAYS"
    echo "  BITS          RSA bits to use      $BITS"
    echo "  KEYPASS       Key password         $KEYPASS"
    echo
    echo "  KEYFILE       Output file          $KEYFILE"
    echo "  CRTFILE       Output file          $CRTFILE"
    echo "  CERTFILE      Output file: KEY+CRT $CERTFILE"
    echo
    echo "# NOTES"
    echo "  Warning: only set password if you know what your doing"
    echo "  Display certificate: openssl x509 -text < $CERTFILE"
    exit 1
fi

TMPCRT=.tmpcrt.pem
TMPKEY=.tmpkey.pem

RDN="/"
[ "$C"  ] && RDN="${RDN}C=${C}/"
[ "$ST" ] && RDN="${RDN}ST=${ST}/"
[ "$L"  ] && RDN="${RDN}L=${L}/"
[ "$O"  ] && RDN="${RDN}O=${O}/"
[ "$OU" ] && RDN="${RDN}OU=${OU}/"
[ "$CN" ] && RDN="${RDN}CN=${CN}/"
[ "$emailAddress" ] && RDN="${RDN}emailAddress=${emailAddress}/"

# create key and password protected cert
openssl req -x509 \
    -newkey rsa:$BITS \
    -keyout $TMPKEY -out $TMPCRT \
    -passout pass:$KEYPASS \
    -days $DAYS \
    -multivalue-rdn -subj "$RDN"

# create needed directories
mkdir -p ${CERTFILE%/*} ${CRTFILE%/*} ${KEYFILE%/*}

# remove password protection from key if not set by user
if [ "$KEYPASS" = "<blank>" ]; then
    openssl rsa -passin pass:$KEYPASS < $TMPKEY > $KEYFILE
    cp $KEYFILE $CERTFILE
else
    cat $TMPKEY > $KEYFILE
    cp $KEYFILE $CERTFILE
fi

# create crt and add it to certfile (key + crt)
cp $TMPCRT $CRTFILE
cat $TMPCRT >> $CERTFILE

# set permissions
if grep -q ^certssl: /etc/group; then
    chgrp certssl $CRTFILE
    chgrp certssl $KEYFILE
    chgrp certssl $CERTFILE
    chmod 640 $KEYFILE
    chmod 640 $CRTFILE
    chmod 640 $CERTFILE
else
    chmod 600 $KEYFILE
    chmod 600 $CRTFILE
    chmod 600 $CERTFILE
fi

# cleanup
rm -f $TMPCRT $TMPKEY
var async = require('async');
var auth = exports;

auth.authenticate_shadow = function(user, plaintext, callback) {
  var hash = require('sha512crypt-node');
  var fs = require('fs-extra');

  function etc_shadow(inner_callback) {
    var passwd = require('etc-passwd');

    fs.stat('/etc/shadow', function(err, stat_info) {
      if (err)
        inner_callback(true)
      else {
        passwd.getShadow({username: user}, function(err, shadow_info) {
          if (shadow_info && shadow_info.password == '!')
            inner_callback(null, false);
          else if (shadow_info) {
            var password_parts = shadow_info['password'].split(/\$/);
            var salt = password_parts[2];
            var new_hash = hash.sha512crypt(plaintext, salt);

            var passed = (new_hash == shadow_info['password'] ? user : false);
            inner_callback(null, passed);
          } else {
            inner_callback(null, false);
          }
        })
      }
    })
  }

  function posix(inner_callback) {
    var crypt = require('apache-crypt');
    var posix = require('posix');

    try {
      var user_data = posix.getpwnam(user);
      if (crypt(plaintext, user_data.passwd) == user_data.passwd)
        inner_callback(user);
      else
        inner_callback(false);
    } catch (e) {
      inner_callback(false);
    }
  }

  etc_shadow(function(err, result_passed) {
    if (err) {
      posix(function(result_passed) {
        callback(result_passed);
      });
    } else {
      callback(result_passed);
    }
  })
}

auth.test_membership = function(username, group, callback) {
  var passwd = require('etc-passwd');
  var userid = require('userid');

  var membership_valid = false;
  var gg = passwd.getGroups()
    .on('group', function(group_data) {
      if (group == group_data.groupname)
        try {
          if (group_data.users.indexOf(username) >= 0 || group_data.gid == userid.gid(username)) 
            membership_valid = true;
        } catch (e) {}
    })
    .on('end', function() {
      callback(membership_valid);
    })
}

auth.verify_ids = function(uid, gid, callback) {
  var passwd = require('etc-passwd');

  var uid_present = false;
  var gid_present = false;

  async.series([
    function(cb) {
      var gg = passwd.getUsers()
        .on('user', function(user_data) {
          if (user_data.uid == uid)
            uid_present = true;
        })
        .on('end', function() {
          if (!uid_present)
            cb('UID ' + uid + ' does not exist on this system');
          else
            cb();
        })
    },
    function(cb) {
      var gg = passwd.getGroups()
        .on('group', function(group_data) {
          if (group_data.gid == gid)
            gid_present = true;
        })
        .on('end', function() {
          if (!gid_present)
            cb('GID ' + gid + ' does not exist on this system');
          else
            cb();
        })
    }
  ], callback)
}
# Logs
logs
*.log

# Runtime data
pids
*.pid
*.seed

# Directory for instrumented libs generated by jscoverage/JSCover
lib-cov

# Coverage directory used by tools like istanbul
coverage

# Grunt intermediate storage (http://gruntjs.com/creating-plugins#storing-task-files)
.grunt

# node-waf configuration
.lock-wscript

# Compiled binary addons (http://nodejs.org/api/addons.html)
build/Release

# Dependency directory
# https://docs.npmjs.com/misc/faq#should-i-check-my-node-modules-folder-into-git
node_modules
# Auto detect text files and perform LF normalization
* text=auto

# Custom for Visual Studio
*.cs     diff=csharp
*.sln    merge=union
*.csproj merge=union
*.vbproj merge=union
*.fsproj merge=union
*.dbproj merge=union

# Standard to msysgit
*.doc	 diff=astextplain
*.DOC	 diff=astextplain
*.docx diff=astextplain
*.DOCX diff=astextplain
*.dot  diff=astextplain
*.DOT  diff=astextplain
*.pdf  diff=astextplain
*.PDF	 diff=astextplain
*.rtf	 diff=astextplain
*.RTF	 diff=astextplain
#!/bin/bash

mkdir -p /var/games/minecraft/profiles
wget --progress=bar --no-check-certificate -P /var/games/minecraft/profiles/1.7.9 https://s3.amazonaws.com/Minecraft.Download/versions/1.7.9/minecraft_server.1.7.9.jar
wget --progress=bar --no-check-certificate -P /var/games/minecraft/profiles/1.2.5 https://s3.amazonaws.com/Minecraft.Download/versions/1.2.5/minecraft_server.1.2.5.jar
wget --progress=bar --no-check-certificate -P /var/games/minecraft/profiles/Pocketmine-1.4.1 https://github.com/PocketMine/PocketMine-MP/releases/download/1.4.1/PocketMine-MP_1.4.1.phar
var async = require('async');
var auth = require('../auth');
var test = exports;

test.authenticate_shadow = function(test) {
  //this test depends on the existence of system user "weak" with password "password"
  async.series([
    function(callback) {
      auth.authenticate_shadow('weak', 'password', function(authed_user) {
        test.equal(authed_user, 'weak');
        callback(!authed_user);
      })
    },
    function(callback) {
      auth.authenticate_shadow('weak', 'notthepassword', function(authed_user) {
        test.equal(authed_user, false);
        callback(authed_user);
      })
    },
    function(callback) {
      auth.authenticate_shadow('fake', 'notthepassword', function(authed_user) {
        test.equal(authed_user, false);
        callback(authed_user);
      })
    },
    function(callback) {
      auth.authenticate_shadow('root', 'notthepassword', function(authed_user) {
        test.equal(authed_user, false);
        callback(authed_user);
      })
    },
    function(callback) {
      auth.authenticate_shadow('root', '', function(authed_user) {
        test.equal(authed_user, false);
        callback(authed_user);
      })
    },
    function(callback) {
      auth.authenticate_shadow('root', '!', function(authed_user) {
        test.equal(authed_user, false);
        callback(authed_user);
      })
    }
  ], function(err, results) {
    test.done();
  })
}

test.test_membership = function(test) {
  async.series([
    function(callback) {
      auth.test_membership('root', 'root', function(is_member) {
        test.equal(is_member, true);
        callback();
      })
    },
    function(callback) {
      auth.test_membership('will', 'root', function(is_member) {
        test.equal(is_member, false);
        callback();
      })
    },
    function(callback) {
      auth.test_membership('will', 'sudo', function(is_member) {
        test.equal(is_member, true);
        callback();
      })
    },
    function(callback) {
      auth.test_membership('will', 'will', function(is_member) {
        test.equal(is_member, true);
        callback();
      })
    },
    function(callback) {
      auth.test_membership('jill', 'will', function(is_member) {
        test.equal(is_member, false);
        callback();
      })
    },
    function(callback) {
      auth.test_membership('jill', 'jill', function(is_member) {
        test.equal(is_member, false);
        callback();
      })
    }
  ], function(err, results) {
    test.done();
  })
}

test.verify_ids = function(test) {
  async.series([
    async.apply(auth.verify_ids, 1000, 1000),
    function(callback) {
      auth.verify_ids(9876, 1000, function(err) {
        test.equal(err, 'UID 9876 does not exist on this system');
        callback();
      })
    },
    function(callback) {
      auth.verify_ids(1000, 9876, function(err) {
        test.equal(err, 'GID 9876 does not exist on this system');
        callback();
      })
    },
    function(callback) {
      auth.verify_ids(9876, 9876, function(err) {
        test.equal(err, 'UID 9876 does not exist on this system');
        callback();
      })
    }
  ], function(err, results) {
    test.ifError(err);
    test.done();
  })
}
var fs = require('fs-extra');
var path = require('path');
var async = require('async');
var mineos = require('../mineos');
var userid = require('userid');
var whoami = require('whoami');
var test = exports;

var BASE_DIR = '/var/games/minecraft';
var FS_DELAY_MS = 200;
var PROC_START_DELAY_MS = 200;

var OWNER_CREDS = {
  uid: userid.uid(process.env.USER) || 1000,
  gid: userid.gid(process.env.USER) || 1000
}

function oct2dec(octal_val) {
  return parseInt(octal_val.toString(8).slice(-3));
}

function delete_everything(callback) {
  var server_list = new mineos.server_list(BASE_DIR);

  function delete_server(server_name, cb) {
    var instance = new mineos.mc(server_name, BASE_DIR);

    async.series([
      function(c) { instance.kill(function(err) { c() }) },
      async.apply(fs.remove, instance.env.cwd),
      async.apply(fs.remove, instance.env.bwd),
      async.apply(fs.remove, instance.env.awd)
    ], cb)
  }

  async.each(server_list, delete_server, callback)
}

test.setUp = function(callback) {
  async.parallel([
    async.apply(fs.ensureDir, path.join(BASE_DIR, mineos.DIRS['servers'])),
    async.apply(fs.ensureDir, path.join(BASE_DIR, mineos.DIRS['archive'])),
    async.apply(fs.ensureDir, path.join(BASE_DIR, mineos.DIRS['backup'])),
    async.apply(fs.ensureDir, path.join(BASE_DIR, mineos.DIRS['profiles'])),
  ], function() {
    delete_everything(callback);
  })
}

test.tearDown = function(callback) {
  delete_everything(callback);
}

test.dependencies_met = function(test) {
  async.series([
    async.apply(mineos.dependencies)
  ], function(err, results) {
    test.ifError(err);
    test.done();
  })
}

test.server_list = function (test) {
  var servers = mineos.server_list(BASE_DIR);
  var instance = new mineos.mc('testing', BASE_DIR);

  instance.create(OWNER_CREDS, function(err, did_create) {
    servers = mineos.server_list(BASE_DIR);
    test.ifError(err);
    test.ok(servers instanceof Array, "server returns an array");
    test.done();
  })
};

test.server_list_up = function(test) {
  var servers = mineos.server_list_up();
  test.ok(servers instanceof Array);

  for (var i=0; i < servers.length; i++) {
    test.ok(/^(?!\.)[a-zA-Z0-9_\.]+$/.test(servers[i]));
  }

  test.done();
}

test.is_server = function(test) {
  //tests if sp exists
  var instance = new mineos.mc('testing', BASE_DIR);

  async.series([
    function(callback) {
      instance.property('!exists', function(err, result) {
        test.ifError(err);
        test.ok(result);
        callback(err);
      })
    },
    async.apply(instance.create, OWNER_CREDS),
    function(callback) {
      instance.property('exists', function(err, result) {
        test.ifError(err);
        test.ok(result);
        callback(err);
      })
    },
  ], function(err) {
    test.ifError(err);
    test.expect(5);
    test.done();
  })
}

test.create_server = function(test) {
  var server_name = 'testing';
  var instance = new mineos.mc(server_name, BASE_DIR);

  test.equal(mineos.server_list(BASE_DIR).length, 0);

  async.series([
    async.apply(instance.create, OWNER_CREDS),
    async.apply(fs.stat, instance.env.cwd),
    async.apply(fs.stat, instance.env.bwd),
    async.apply(fs.stat, instance.env.awd),
    async.apply(fs.stat, instance.env.sp),
    async.apply(fs.stat, instance.env.sc),
    async.apply(fs.stat, instance.env.cc),
    function(callback) {
      test.equal(fs.statSync(instance.env.cwd).uid, OWNER_CREDS['uid']);
      test.equal(fs.statSync(instance.env.bwd).uid, OWNER_CREDS['uid']);
      test.equal(fs.statSync(instance.env.awd).uid, OWNER_CREDS['uid']);
      test.equal(fs.statSync(instance.env.sp).uid, OWNER_CREDS['uid']);
      test.equal(fs.statSync(instance.env.sc).uid, OWNER_CREDS['uid']);
      test.equal(fs.statSync(instance.env.cc).uid, OWNER_CREDS['uid']);

      test.equal(fs.statSync(instance.env.cwd).gid, OWNER_CREDS['gid']);
      test.equal(fs.statSync(instance.env.bwd).gid, OWNER_CREDS['gid']);
      test.equal(fs.statSync(instance.env.awd).gid, OWNER_CREDS['gid']);
      test.equal(fs.statSync(instance.env.sp).gid, OWNER_CREDS['gid']);
      test.equal(fs.statSync(instance.env.sc).gid, OWNER_CREDS['gid']);
      test.equal(fs.statSync(instance.env.cc).gid, OWNER_CREDS['gid']);

      test.equal(oct2dec(fs.statSync(instance.env.sp).mode), 664);
      test.equal(oct2dec(fs.statSync(instance.env.sc).mode), 664);
      test.equal(oct2dec(fs.statSync(instance.env.cc).mode), 664);

      test.equal(mineos.server_list(BASE_DIR)[0], server_name);
      test.equal(mineos.server_list(BASE_DIR).length, 1);

      instance.sc(function(err, dict) {
        test.equal(dict.java.java_xmx, '256');
        test.equal(dict.onreboot.start, false);
      })

      callback();
    },
    function(callback) {
      instance.create(OWNER_CREDS, function(err){
        test.ifError(!err);
        callback(!err);
      })
    }
  ], function(err) {
    test.ifError(err);
    test.done();
  })
}

test.server_ownership = function(test) {
  var server_name = 'testing';
  var instance = new mineos.mc(server_name, BASE_DIR);

  async.series([
    function(callback) {
      instance.property('owner', function(err, result) {
        test.ifError(!err);
        test.equal(Object.keys(result).length, 0);
        callback(!err);
      })
    },
    function(callback) {
      instance.property('owner_uid', function(err, result) {
        test.ifError(!err);
        test.equal(result, null);
        callback(!err);
      })
    },
    function(callback) {
      instance.property('owner_gid', function(err, result) {
        test.ifError(!err);
        test.equal(result, null);
        callback(!err);
      })
    },
    async.apply(instance.create, OWNER_CREDS),
    function(callback) {
      instance.property('owner_uid', function(err, result) {
        test.ifError(err);
        test.equal(result, OWNER_CREDS['uid']);
        callback(err);
      })
    },
    function(callback) {
      instance.property('owner_gid', function(err, result) {
        test.ifError(err);
        test.equal(result, OWNER_CREDS['gid']);
        callback(err);
      })
    },
    function(callback) {
      instance.property('owner', function(err, result) {
        test.ifError(err);
        test.equal(result['uid'], OWNER_CREDS['uid']);
        test.equal(result['gid'], OWNER_CREDS['gid']);
        callback(err);
      })
    }
  ], function(err) {
    test.ifError(err);
    test.expect(14);
    test.done();
  })
}

test.delete_server = function(test) {
  var server_name = 'testing';
  var instance = new mineos.mc(server_name, BASE_DIR);

  async.series([
    function(callback) {
      instance.delete(function(err) {
        test.ifError(!err);
        callback(!err);
      })
    },
    async.apply(instance.create, OWNER_CREDS),
    async.apply(instance.verify, 'exists'),
    async.apply(instance.delete),
    async.apply(instance.verify, '!exists'),
  ], function(err) {
    test.ifError(err);
    test.expect(2);
    test.done();
  })
}

test.mc_instance = function(test) {
  var server_name = 'testing';
  var instance = new mineos.mc(server_name, BASE_DIR);

  test.ok(instance.env instanceof Object);

  test.equal(instance.env.cwd, path.join(BASE_DIR, mineos.DIRS['servers'], server_name));
  test.equal(instance.env.bwd, path.join(BASE_DIR, mineos.DIRS['backup'], server_name));
  test.equal(instance.env.awd, path.join(BASE_DIR, mineos.DIRS['archive'], server_name));
  test.equal(instance.env.base_dir, BASE_DIR);
  test.equal(instance.server_name, server_name);
  test.equal(instance.env.sp, path.join(BASE_DIR, mineos.DIRS['servers'], server_name, 'server.properties'));
  test.done();
}

test.valid_server_name = function(test) {
  var regex_valid_server_name = /^(?!\.)[a-zA-Z0-9_\.]+$/;
  test.ok(mineos.valid_server_name('aaa'));
  test.ok(mineos.valid_server_name('server_1'));
  test.ok(mineos.valid_server_name('myserver'));
  test.ok(mineos.valid_server_name('1111'));
  test.ok(!mineos.valid_server_name('.aaa'));
  test.ok(!mineos.valid_server_name(''));
  test.ok(!mineos.valid_server_name('something!'));
  test.ok(!mineos.valid_server_name('#hashtag'));
  test.ok(!mineos.valid_server_name('my server'));
  test.ok(!mineos.valid_server_name('bukkit^ftb'));

  test.done();
}

test.extract_server_name = function(test) {
  test.equal(mineos.extract_server_name(BASE_DIR, '/var/games/minecraft/servers/a'), 'a');
  test.equal(mineos.extract_server_name(BASE_DIR, '/var/games/minecraft/servers/a/b'), 'a');
  test.equal(mineos.extract_server_name(BASE_DIR, '/var/games/minecraft/servers/a/b/plugins'), 'a');
  test.throws(function(){mineos.extract_server_name(BASE_DIR, '/var/games/minecraft/servers')}, 'no server name in path');
  test.throws(function(){mineos.extract_server_name(BASE_DIR, '/var/games/minecraft')}, 'no server name in path');
  test.done();
}

test.get_start_args = function(test) {
  var server_name = 'testing';
  var instance = new mineos.mc(server_name, BASE_DIR);

  async.series([
    async.apply(instance.create, OWNER_CREDS),
    function(callback) {
      instance.get_start_args(function(err, args) {
        test.ifError(!err); //expected error
        test.equal(err, 'Cannot start server without a designated jar/phar.');
        test.equal(args, null);
        callback(!err);
      })
    },
    async.apply(instance.modify_sc, 'java', 'jarfile', 'PocketMine-MP.phar'),
    function(callback) {
      instance.get_start_args(function(err, args) {
        test.ifError(err);
        test.equal(args[0], '-dmS');
        test.equal(args[1], 'mc-testing');
        test.equal(args[2], './bin/php5/bin/php');
        test.equal(args[3], 'PocketMine-MP.phar');
        callback(err);
      })
    },
    async.apply(instance.modify_sc, 'java', 'jarfile', 'minecraft_server.1.7.9.jar'),
    function(callback) {
      instance.get_start_args(function(err, args) {
        test.ifError(err);
        test.equal(args[0], '-dmS');
        test.equal(args[1], 'mc-testing');
        test.equal(args[2].slice(-4), 'java');
        test.equal(args[3], '-server');
        test.equal(args[4], '-Xmx256M');
        test.equal(args[5], '-Xms256M');
        test.equal(args[6], '-jar');
        test.equal(args[7], 'minecraft_server.1.7.9.jar');
        test.equal(args[8], 'nogui');
        callback(err);
      })
    },
  ], function(err) {
    test.ifError(err);
    test.done();
  })
}

test.get_start_args_java = function(test) {
  var server_name = 'testing';
  var instance = new mineos.mc(server_name, BASE_DIR);

  async.series([
    async.apply(instance.create, OWNER_CREDS),
    async.apply(instance.modify_sc, 'java', 'java_xmx', '-256'),
    function(callback) {
      instance.get_start_args(function(err, args) {
        test.ifError(!err); //testing for positive error
        test.equal(args, null);
        test.equal(err, 'Cannot start server without a designated jar/phar.');
        callback(!err);
      })
    },
    async.apply(instance.modify_sc, 'java', 'java_xmx', '256'),
    function(callback) {
      instance.get_start_args(function(err, args) {
        test.ifError(!err); //testing for positive error
        test.equal(args, null);
        test.equal(err, 'Cannot start server without a designated jar/phar.');
        callback(!err);
      })
    },
    async.apply(instance.modify_sc, 'java', 'jarfile', 'minecraft_server.1.7.9.jar'),
    function(callback) {
      instance.get_start_args(function(err, args) {
        test.ifError(err);
        test.equal(args[0], '-dmS');
        test.equal(args[1], 'mc-testing');
        test.equal(args[2].slice(-4), 'java');
        test.equal(args[3], '-server');
        test.equal(args[4], '-Xmx256M');
        test.equal(args[5], '-Xms256M');
        test.equal(args[6], '-jar');
        test.equal(args[7], 'minecraft_server.1.7.9.jar');
        test.equal(args[8], 'nogui');
        callback(err);
      })
    },
    async.apply(instance.modify_sc, 'java', 'java_xms', '-256'),
    function(callback) {
      instance.get_start_args(function(err, args) {
        test.ifError(!err); //testing for positive error
        test.equal(Object.keys(args).length, 0);
        test.equal(err, 'XMS heapsize must be positive integer where XMX >= XMS > 0');
        callback(!err);
      })
    },
    async.apply(instance.modify_sc, 'java', 'java_xms', '128'),
    function(callback) {
      instance.get_start_args(function(err, args) {
        test.ifError(err);
        test.equal(args[0], '-dmS');
        test.equal(args[1], 'mc-testing');
        test.equal(args[2].slice(-4), 'java');
        test.equal(args[3], '-server');
        test.equal(args[4], '-Xmx256M');
        test.equal(args[5], '-Xms128M');
        test.equal(args[6], '-jar');
        test.equal(args[7], 'minecraft_server.1.7.9.jar');
        test.equal(args[8], 'nogui');
        callback(err);
      })
    },
    async.apply(instance.modify_sc, 'java', 'java_tweaks', '-Xmx2G -XX:MaxPermSize=256M'),
    function(callback) {
      instance.get_start_args(function(err, args) {
        test.ifError(err);
        test.equal(args[0], '-dmS');
        test.equal(args[1], 'mc-testing');
        test.equal(args[2].slice(-4), 'java');
        test.equal(args[3], '-server');
        test.equal(args[4], '-Xmx256M');
        test.equal(args[5], '-Xms128M');
        test.equal(args[6], '-Xmx2G');
        test.equal(args[7], '-XX:MaxPermSize=256M');
        test.equal(args[8], '-jar');
        test.equal(args[9], 'minecraft_server.1.7.9.jar');
        test.equal(args[10], 'nogui');
        test.equal(args.length, 11);
        callback(err);
      })
    },
    async.apply(instance.modify_sc, 'java', 'jar_args', ''),
    function(callback) {
      instance.get_start_args(function(err, args) {
        test.ifError(err);
        test.equal(args[0], '-dmS');
        test.equal(args[1], 'mc-testing');
        test.equal(args[2].slice(-4), 'java');
        test.equal(args[3], '-server');
        test.equal(args[4], '-Xmx256M');
        test.equal(args[5], '-Xms128M');
        test.equal(args[6], '-Xmx2G');
        test.equal(args[7], '-XX:MaxPermSize=256M');
        test.equal(args[8], '-jar');
        test.equal(args[9], 'minecraft_server.1.7.9.jar');
        test.equal(args[10], 'nogui');
        test.equal(args.length, 11);
        callback(err);
      })
    },
    async.apply(instance.modify_sc, 'java', 'jar_args', '--installServer'),
    function(callback) {
      instance.get_start_args(function(err, args) {
        test.ifError(err);
        test.equal(args[0], '-dmS');
        test.equal(args[1], 'mc-testing');
        test.equal(args[2].slice(-4), 'java');
        test.equal(args[3], '-server');
        test.equal(args[4], '-Xmx256M');
        test.equal(args[5], '-Xms128M');
        test.equal(args[6], '-Xmx2G');
        test.equal(args[7], '-XX:MaxPermSize=256M');
        test.equal(args[8], '-jar');
        test.equal(args[9], 'minecraft_server.1.7.9.jar');
        test.equal(args[10], '--installServer');
        test.equal(args.length, 11);
        callback(err);
      })
    },
    async.apply(instance.modify_sc, 'java', 'jar_args', 'nogui --installServer'),
    function(callback) {
      instance.get_start_args(function(err, args) {
        test.ifError(err);
        test.equal(args[0], '-dmS');
        test.equal(args[1], 'mc-testing');
        test.equal(args[2].slice(-4), 'java');
        test.equal(args[3], '-server');
        test.equal(args[4], '-Xmx256M');
        test.equal(args[5], '-Xms128M');
        test.equal(args[6], '-Xmx2G');
        test.equal(args[7], '-XX:MaxPermSize=256M');
        test.equal(args[8], '-jar');
        test.equal(args[9], 'minecraft_server.1.7.9.jar');
        test.equal(args[10], 'nogui');
        test.equal(args[11], '--installServer');
        test.equal(args.length, 12);
        callback(err);
      })
    }
  ], function(err) {
    test.ifError(err);
    test.done();
  })
}

test.get_start_args_forge = function(test) {
  var server_name = 'testing';
  var instance = new mineos.mc(server_name, BASE_DIR);

  async.series([
    async.apply(instance.create, OWNER_CREDS),
    async.apply(instance.modify_sc, 'java', 'jarfile', 'forge-1.7.10-10.13.4.1492-installer.jar'),
    function(callback) {
      instance.get_start_args(function(err, args) {
        test.ifError(err);
        test.equal(args[0], '-dmS');
        test.equal(args[1], 'mc-testing');
        test.equal(args[2].slice(-4), 'java');
        test.equal(args[3], '-server');
        test.equal(args[4], '-Xmx256M');
        test.equal(args[5], '-Xms256M');
        test.equal(args[6], '-jar');
        test.equal(args[7], 'forge-1.7.10-10.13.4.1492-installer.jar');
        test.equal(args[8], 'nogui');
        test.equal(args[9], '--installServer');
        callback(err);
      })
    },
    async.apply(instance.modify_sc, 'java', 'jarfile', 'forge-1.7.10-10.13.4.1492-universal.jar'),
    function(callback) {
      instance.get_start_args(function(err, args) {
        test.ifError(err);
        test.equal(args[0], '-dmS');
        test.equal(args[1], 'mc-testing');
        test.equal(args[2].slice(-4), 'java');
        test.equal(args[3], '-server');
        test.equal(args[4], '-Xmx256M');
        test.equal(args[5], '-Xms256M');
        test.equal(args[6], '-jar');
        test.equal(args[7], 'forge-1.7.10-10.13.4.1492-universal.jar');
        test.equal(args[8], 'nogui');
        callback(err);
      })
    },
  ], function(err) {
    test.ifError(err);
    test.done();
  })
}

test.get_start_args_phar = function(test) {
  var server_name = 'testing';
  var instance = new mineos.mc(server_name, BASE_DIR);

  async.series([
    async.apply(instance.create, OWNER_CREDS),
    async.apply(instance.modify_sc, 'java', 'jarfile', 'PocketMine-MP.phar'),
    function(callback) {
      instance.get_start_args(function(err, args) {
        test.ifError(err);
        test.equal(args[0], '-dmS');
        test.equal(args[1], 'mc-testing');
        test.equal(args[2], './bin/php5/bin/php');
        test.equal(args[3], 'PocketMine-MP.phar');
        callback(err);
      })
    }
  ], function(err) {
    test.ifError(err);
    test.done();
  })
}

test.get_start_args_unconventional = function(test) {
  var server_name = 'testing';
  var instance = new mineos.mc(server_name, BASE_DIR);

  async.series([
    async.apply(instance.create_unconventional_server, OWNER_CREDS),
    async.apply(instance.modify_sc, 'minecraft', 'unconventional', true),
    function(callback) {
      instance.get_start_args(function(err, args) {
        test.ifError(!err); //expected error
        test.equal(err, 'Cannot start server without a designated jar/phar.');
        test.equal(args, null);
        callback(!err);
      })
    },
    async.apply(instance.modify_sc, 'java', 'jarfile', 'BungeeCord-1078.jar'),
    function(callback) {
      instance.get_start_args(function(err, args) {
        test.ifError(err);
        test.equal(args[0], '-dmS');
        test.equal(args[1], 'mc-testing');
        test.equal(args[2].slice(-4), 'java');
        test.equal(args[3], '-server');
        test.equal(args[4], '-jar');
        test.equal(args[5], 'BungeeCord-1078.jar');
        callback(err);
      })
    },
    async.apply(instance.modify_sc, 'java', 'java_xmx', 256),
    function(callback) {
      instance.get_start_args(function(err, args) {
        test.ifError(err);
        test.equal(args[0], '-dmS');
        test.equal(args[1], 'mc-testing');
        test.equal(args[2].slice(-4), 'java');
        test.equal(args[3], '-server');
        test.equal(args[4], '-Xmx256M');
        test.equal(args[5], '-jar');
        test.equal(args[6], 'BungeeCord-1078.jar');
        callback(err);
      })
    },
    async.apply(instance.modify_sc, 'java', 'java_xms', 128),
    function(callback) {
      instance.get_start_args(function(err, args) {
        test.ifError(err);
        test.equal(args[0], '-dmS');
        test.equal(args[1], 'mc-testing');
        test.equal(args[2].slice(-4), 'java');
        test.equal(args[3], '-server');
        test.equal(args[4], '-Xmx256M');
        test.equal(args[5], '-Xms128M');
        test.equal(args[6], '-jar');
        test.equal(args[7], 'BungeeCord-1078.jar');
        callback(err);
      })
    },
    async.apply(instance.modify_sc, 'java', 'jar_args', ''),
    function(callback) {
      instance.get_start_args(function(err, args) {
        test.ifError(err);
        test.equal(args[0], '-dmS');
        test.equal(args[1], 'mc-testing');
        test.equal(args[2].slice(-4), 'java');
        test.equal(args[3], '-server');
        test.equal(args[4], '-Xmx256M');
        test.equal(args[5], '-Xms128M');
        test.equal(args[6], '-jar');
        test.equal(args[7], 'BungeeCord-1078.jar');
        test.equal(args.length, 8);
        callback(err);
      })
    },
    async.apply(instance.modify_sc, 'java', 'jar_args', 'nogui'),
    function(callback) {
      instance.get_start_args(function(err, args) {
        test.ifError(err);
        test.equal(args[0], '-dmS');
        test.equal(args[1], 'mc-testing');
        test.equal(args[2].slice(-4), 'java');
        test.equal(args[3], '-server');
        test.equal(args[4], '-Xmx256M');
        test.equal(args[5], '-Xms128M');
        test.equal(args[6], '-jar');
        test.equal(args[7], 'BungeeCord-1078.jar');
        test.equal(args[8], 'nogui');
        test.equal(args.length, 9);
        callback(err);
      })
    },
    async.apply(instance.modify_sc, 'java', 'jar_args', 'nogui --installServer'),
    function(callback) {
      instance.get_start_args(function(err, args) {
        test.ifError(err);
        test.equal(args[0], '-dmS');
        test.equal(args[1], 'mc-testing');
        test.equal(args[2].slice(-4), 'java');
        test.equal(args[3], '-server');
        test.equal(args[4], '-Xmx256M');
        test.equal(args[5], '-Xms128M');
        test.equal(args[6], '-jar');
        test.equal(args[7], 'BungeeCord-1078.jar');
        test.equal(args[8], 'nogui');
        test.equal(args[9], '--installServer');
        test.equal(args.length, 10);
        callback(err);
      })
    }
  ], function(err) {
    test.ifError(err);
    test.done();
  })
}

test.start = function(test) {
  var server_name = 'testing';
  var instance = new mineos.mc(server_name, BASE_DIR);

  async.series([
    function(callback) {
      instance.stuff('stop', function(err, proc) {
        test.ifError(!err);
        callback(!err);
      })
    },
    async.apply(instance.create, OWNER_CREDS),
    async.apply(instance.modify_sc, 'minecraft', 'profile', '1.7.9'),
    async.apply(instance.modify_sc, 'java', 'jarfile', 'minecraft_server.1.7.9.jar'),
    async.apply(instance.copy_profile),
    async.apply(instance.start),
    function(callback) {
      instance.property('screen_pid', function(err, pid) {
        test.ifError(err);
        test.equal(typeof(pid), 'number');
        test.ok(pid > 0);
        callback(err);
      })
    },
    function(callback) {
      instance.property('java_pid', function(err, pid) {
        test.ifError(err);
        test.equal(typeof(pid), 'number');
        test.ok(pid > 0);
        callback(err);
      })
    },
    function(callback) {
      instance.start(function(err) {
        test.ifError(!err);
        callback(!err);
      })
    },
    async.apply(instance.kill)
  ], function(err, results) {
    test.ifError(err);
    test.expect(9);
    test.done();
  })
}

test.stop = function(test) {
  var server_name = 'testing';
  var instance = new mineos.mc(server_name, BASE_DIR);

  async.series([
    function(callback) {
      instance.stop(function(err) {
        test.ifError(!err);
        callback(!err);
      })
    },
    async.apply(instance.create, OWNER_CREDS),
    async.apply(instance.modify_sc, 'minecraft', 'profile', '1.7.9'),
    async.apply(instance.modify_sc, 'java', 'jarfile', 'minecraft_server.1.7.9.jar'),
    async.apply(instance.copy_profile),
    async.apply(instance.start),
    async.apply(instance.verify, 'up'),
    async.apply(instance.stop),
    async.apply(instance.verify, '!up')
  ], function(err, results) {
    test.ifError(err);
    test.expect(2);
    test.done();
  })
}

test.stop_and_backup = function(test) {
  var server_name = 'testing';
  var instance = new mineos.mc(server_name, BASE_DIR);

  async.series([
    async.apply(instance.create, OWNER_CREDS),
    async.apply(instance.modify_sc, 'minecraft', 'profile', '1.7.9'),
    async.apply(instance.modify_sc, 'java', 'jarfile', 'minecraft_server.1.7.9.jar'),
    async.apply(instance.copy_profile),
    async.apply(instance.start),
    async.apply(instance.stop_and_backup),
    async.apply(instance.verify, '!up'),
    function(callback) {
      test.ok(fs.readdirSync(instance.env.bwd).length > 2);
      callback(null);
    }
  ], function(err) {
    test.ifError(err);
    test.expect(2);
    test.done();
  })
}

test.restart = function(test) {
  var server_name = 'testing';
  var instance = new mineos.mc(server_name, BASE_DIR);

  async.series([
    async.apply(instance.create, OWNER_CREDS),
    async.apply(instance.modify_sc, 'minecraft', 'profile', '1.7.9'),
    async.apply(instance.modify_sc, 'java', 'jarfile', 'minecraft_server.1.7.9.jar'),
    async.apply(instance.copy_profile),
    async.apply(instance.start),
    function(callback) {
      setTimeout(callback, 10000);
    },
    async.apply(instance.verify, 'up'),
    async.apply(instance.restart),
    async.apply(instance.verify, 'up'),
  ], function(err) {
    test.ifError(err);
    test.expect(1);
    test.done();
  })
}

test.kill = function(test) {
  var server_name = 'testing';
  var instance = new mineos.mc(server_name, BASE_DIR);

  async.series([
    function(callback) {
      instance.kill(function(err) {
        test.ifError(!err);
        callback(!err);
      })
    },
    async.apply(instance.create, OWNER_CREDS),
    function(callback) {
      instance.kill(function(err) {
        test.ifError(!err);
        callback(!err);
      })
    },
    async.apply(instance.modify_sc, 'minecraft', 'profile', '1.7.9'),
    async.apply(instance.modify_sc, 'java', 'jarfile', 'minecraft_server.1.7.9.jar'),
    async.apply(instance.copy_profile),
    async.apply(instance.start),
    async.apply(instance.verify, 'up'),
    async.apply(instance.kill),
    async.apply(instance.verify, '!up'),
    function(callback) {
      instance.kill(function(err) {
        test.ifError(!err);
        callback(!err);
      })
    }
  ], function(err) {
    test.ifError(err);
    test.expect(4);
    test.done();
  })
}

test.archive = function(test) {
  var server_name = 'testing';
  var instance = new mineos.mc(server_name, BASE_DIR);

  async.series([
    async.apply(instance.create, OWNER_CREDS),
    async.apply(instance.archive),
    function(callback) {
      test.equal(fs.readdirSync(instance.env.awd).length, 1);
      callback(null);
    }
  ], function(err) {
    test.ifError(err);
    test.expect(2);
    test.done();
  })
}

test.backup = function(test) {
  var server_name = 'testing';
  var instance = new mineos.mc(server_name, BASE_DIR);

  async.series([
    async.apply(instance.create, OWNER_CREDS),
    async.apply(instance.backup),
    function(callback) {
      test.equal(fs.readdirSync(instance.env.bwd).length, 4);
      callback(null);
    }
  ], function(err) {
    test.ifError(err);
    test.expect(2);
    test.done();
  })
}

test.restore = function(test) {
  var server_name = 'testing';
  var instance = new mineos.mc(server_name, BASE_DIR);

  async.series([
    async.apply(instance.create, OWNER_CREDS),
    async.apply(instance.backup),
    async.apply(fs.remove, instance.env.cwd),
    async.apply(instance.verify, '!exists'),
    async.apply(instance.restore, 'now'),
    function(callback) {
      test.equal(fs.readdirSync(instance.env.cwd).length, 3);
      callback(null);
    }
  ], function(err) {
    test.ifError(err);
    test.expect(2);
    test.done();
  })
}

test.sc = function(test) {
  var server_name = 'testing';
  var instance = new mineos.mc(server_name, BASE_DIR);

  async.series([
    async.apply(instance.create, OWNER_CREDS),
    async.apply(instance.modify_sc, 'java', 'java_xmx', '512'),
    function(callback) {
      instance.sc(function(err, dict) {
        test.ifError(err);
        test.equal(dict.java.java_xmx, '512');
        callback(err);
      })
    },
    async.apply(instance.modify_sc, 'java', 'java_xms', '256'),
    function(callback) {
      instance.sc(function(err, dict) {
        test.ifError(err);
        test.equal(dict.java.java_xms, '256');
        test.equal(dict.java.java_xmx, '512');
        callback(err);
      })
    },
    async.apply(instance.modify_sc, 'java', 'java_xmx', '1024'),
    function(callback) {
      instance.sc(function(err, dict) {
        test.ifError(err);
        test.equal(dict.java.java_xms, '256');
        test.equal(dict.java.java_xmx, '1024');
        callback(err);
      })
    },
  ], function(err) {
    test.ifError(err);
    test.expect(9);
    test.done();
  })
}

test.sc_deleted = function(test) {
  var server_name = 'testing';
  var instance = new mineos.mc(server_name, BASE_DIR);
  
  async.series([
    async.apply(instance.create, OWNER_CREDS),
    function(callback) {
      instance.sc(function(err, dict) {
        test.ifError(err);
        test.equal(dict.java.java_xmx, '256');
        callback(err);
      })
    },
    async.apply(fs.remove, instance.env['sc']),
    function(callback) {
      instance.sc(function(err, dict) {
        test.ifError(err);
        test.equal(Object.keys(dict).length, 0);
        callback(err);
      })
    },
    async.apply(instance.modify_sc, 'java', 'java_xmx', '1024'),
    function(callback) {
      instance.sc(function(err, dict) {
        test.ifError(err);
        test.equal(dict.java.java_xmx, '1024');
        callback(err);
      })
    }
  ], function(err) {
    test.ifError(err);
    test.done();
  })
}

test.sp = function(test) {
  var server_name = 'testing';
  var instance = new mineos.mc(server_name, BASE_DIR);

  async.series([
    async.apply(instance.create, OWNER_CREDS),
    function(callback) {
      instance.sp(function(err, dict) {
        test.ifError(err);
        test.equal(dict['server-port'], '25565');
        callback(err);
      })
    },
    async.apply(instance.modify_sp, 'server-port', '25570'),
    function(callback) {
      instance.sp(function(err, dict) {
        test.ifError(err);
        test.equal(dict['server-port'], '25570');
        callback(err);
      })
    }
  ], function(err) {
    test.ifError(err);
    test.expect(5);
    test.done();
  })
}

test.owner_unknown_ids = function(test) {
  var server_name = 'testing';
  var instance = new mineos.mc(server_name, BASE_DIR);

  async.series([
    async.apply(instance.create, OWNER_CREDS),
    async.apply(fs.chown, instance.env.cwd, 4141, 4141),
    function(callback) {
      instance.property('owner', function(err, owner_info) {
        test.ifError(err);
        test.ok('uid' in owner_info);
        test.ok('gid' in owner_info);
        test.equal(owner_info.username, '?');
        test.equal(owner_info.groupname, '?');
        callback(err);
      })
    }
  ], function(err) {
    test.ifError(err);
    test.done();
  })
}

test.properties = function(test) {
  var server_name = 'testing';
  var instance = new mineos.mc(server_name, BASE_DIR);

  async.series([
    function(callback) {
      instance.property('exists', function(err, does_exist) {
        test.ifError(err);
        test.ok(!does_exist);
        callback(err);
      })
    },
    function(callback) {
      instance.property('java_pid', function(err, java_pid) {
        test.ok(err); //looking for positive error
        test.equal(java_pid, null);
        callback(!err);
      })
    },
    function(callback) {
      instance.property('screen_pid', function(err, screen_pid) {
        test.ok(err); //looking for positive error
        test.equal(screen_pid, null);
        callback(!err);
      })
    },
    function(callback) {
      instance.create(OWNER_CREDS, function(err) {
        test.ifError(err);
        callback(err);
      })
    },
    function(callback) {
      instance.property('exists', function(err, does_exist) {
        test.ifError(err);
        test.ok(does_exist);
        callback(err);
      })
    },
    function(callback) {
      instance.property('owner', function(err, owner_info) {
        test.ifError(err);
        test.ok('uid' in owner_info);
        test.ok('gid' in owner_info);
        test.ok('username' in owner_info);
        test.ok('groupname' in owner_info);
        callback(err);
      })
    },
    function(callback) {
      instance.property('up', function(err, up) {
        test.ifError(err);
        test.equal(up, false);
        callback(err);
      })
    },
    function(callback) {
      instance.property('server-port', function(err, port) {
        test.ifError(err);
        test.equal(port, 25565);
        callback(err);
      })
    },
    function(callback) {
      instance.property('server-ip', function(err, ip) {
        test.ifError(err);
        test.equal(ip, '0.0.0.0');
        callback(err);
      })
    },
    function(callback) {
      instance.property('memory', function(err, memory) {
        test.ok(err); //testing for error
        test.equal(memory, null);
        callback(!err);
      })
    },
    function(callback) {
      instance.property('ping', function(err, ping) {
        test.ok(err); //testing for error
        test.equal(ping, null)
        callback(!err);
      })
    },
    async.apply(instance.modify_sc, 'minecraft', 'profile', '1.7.9'),
    async.apply(instance.modify_sc, 'java', 'jarfile', 'minecraft_server.1.7.9.jar'),
    async.apply(instance.copy_profile),
    function(callback) {
      instance.start(function(err) {
        test.ifError(err);
        setTimeout(function() {callback(err)}, PROC_START_DELAY_MS)
      })
    },
    function(callback) {
      instance.property('java_pid', function(err, java_pid) {
        test.ifError(err);
        test.equal(typeof(java_pid), 'number');
        callback(err);
      })
    },
    function(callback) {
      instance.property('screen_pid', function(err, screen_pid) {
        test.ifError(err);
        test.equal(typeof(screen_pid), 'number');
        callback(err);
      })
    },
    function(callback) {
      instance.property('exists', function(err, does_exist) {
        test.ifError(err);
        test.ok(does_exist);
        callback(err);
      })
    },
    function(callback) {
      instance.property('up', function(err, up) {
        test.ifError(err);
        test.equal(up, true);
        callback(err);
      })
    },
    function(callback) {
      instance.property('server-port', function(err, port) {
        test.ifError(err);
        test.equal(port, 25565);
        callback(err);
      })
    },
    function(callback) {
      instance.property('server-ip', function(err, ip) {
        test.ifError(err);
        test.equal(ip, '0.0.0.0');
        callback(err);
      })
    },
    function(callback) {
      instance.property('memory', function(err, memory) {
        test.ifError(err);
        test.ok(memory);
        test.ok('VmRSS' in memory);
        callback(err);
      })
    },
    function(callback) {
      instance.property('du_awd', function(err, bytes) {
        test.ifError(err);
        test.ok(!isNaN(bytes));
        callback(err);
      })
    },function(callback) {
      instance.property('du_bwd', function(err, bytes) {
        test.ifError(err);
        test.ok(!isNaN(bytes));
        callback(err);
      })
    },
    function(callback) {
      instance.property('du_cwd', function(err, bytes) {
        test.ifError(err);
        test.ok(!isNaN(bytes));
        callback(err);
      })
    },
    function(callback) {
      instance.property('unconventional', function(err, retval) {
        test.ifError(err);
        test.equal(retval, false);
        callback(err);
      })
    },
    function(callback) {
      instance.property('madeup', function(err, retval) {
        test.ok(err);  //testing positive error
        test.equal(retval, undefined);
        callback(!err);
      })
    },
    function(callback) {
      setTimeout(function() {
        instance.kill(function(err) {
          test.ifError(err);
          callback(err);
        })
      }, 200)
    }
  ], function(err) {
    test.ifError(err);
    test.done();
  })
}

test.verify = function(test) {
  var server_name = 'testing';
  var instance = new mineos.mc(server_name, BASE_DIR);
  
  async.series([
    async.apply(instance.verify, '!exists'),
    function(callback) {
      instance.verify('exists', function(err) {
        test.ifError(!err);
        test.equal(err, 'exists');
        callback(!err);
      })
    },
    async.apply(instance.verify, '!up'),
    function(callback) {
      instance.verify('up', function(err) {
        test.ifError(!err);
        test.equal(err, 'up');
        callback(!err);
      })
    },
    async.apply(instance.create, OWNER_CREDS),
    function(callback) {
      instance.verify('!exists', function(err) {
        test.ifError(!err);
        test.equal(err, '!exists');
        callback(!err);
      })
    },
    async.apply(instance.verify, 'exists'),
    async.apply(instance.verify, '!up'),
    function(callback) {
      instance.verify('up', function(err) {
        test.ifError(!err);
        test.equal(err, 'up');
        callback(!err);
      })
    },
    async.apply(instance.modify_sc, 'minecraft', 'profile', '1.7.9'),
    async.apply(instance.modify_sc, 'java', 'jarfile', 'minecraft_server.1.7.9.jar'),
    async.apply(instance.copy_profile),
    async.apply(instance.start),
    function(callback) {
      instance.verify('!exists', function(err) {
        test.ifError(!err);
        test.equal(err, '!exists');
        callback(!err);
      })
    },
    async.apply(instance.verify, 'exists'),
    function(callback) {
      instance.verify('!up', function(err) {
        test.ifError(!err);
        test.equal(err, '!up');
        callback(!err);
      })
    },
    async.apply(instance.verify, 'up'),
    async.apply(instance.kill)
  ], function(err) {
    test.expect(12);
    test.done();
  })
}

test.ping = function(test) {
  var server_name = 'testing';
  var instance = new mineos.mc(server_name, BASE_DIR);

  async.series([
    async.apply(instance.create, OWNER_CREDS),
    async.apply(instance.modify_sc, 'minecraft', 'profile', '1.7.9'),
    async.apply(instance.modify_sc, 'java', 'jarfile', 'minecraft_server.1.7.9.jar'),
    async.apply(instance.copy_profile),
    async.apply(instance.start),
    function(callback) {
      setTimeout(function() {
        instance.ping(function(err, pingback) {
          test.ifError(err);
          test.equal(pingback.protocol, 127);
          test.equal(pingback.server_version, '1.7.9');
          test.equal(pingback.motd, 'A Minecraft Server');
          test.equal(pingback.players_online, 0);
          test.equal(pingback.players_max, 20);
          callback(err);
        })
      }, 22000)
    },
    async.apply(instance.kill)
  ], function(err) {
    test.ifError(err);
    test.expect(7);
    test.done();
  })
}

test.ping_legacy = function(test) {
  var server_name = 'testing';
  var instance = new mineos.mc(server_name, BASE_DIR);

  async.series([
    async.apply(instance.create, OWNER_CREDS),
    async.apply(instance.modify_sc, 'minecraft', 'profile', '1.2.5'),
    async.apply(instance.modify_sc, 'java', 'jarfile', 'minecraft_server.1.2.5.jar'),
    async.apply(instance.copy_profile),
    async.apply(instance.start),
    function(callback) {
      setTimeout(function() {
        instance.ping(function(err, pingback) {
          test.ifError(err);
          test.equal(pingback.protocol, '');
          test.equal(pingback.server_version, '');
          test.equal(pingback.motd, 'A Minecraft Server');
          test.equal(pingback.players_online, 0);
          test.equal(pingback.players_max, 20);
          callback(err);
        })
      }, 10000)
    },
    async.apply(instance.kill)
  ], function(err) {
    test.ifError(err);
    test.expect(7);
    test.done();
  })
}

test.ping_phar = function(test) {
  var server_name = 'testing';
  var instance = new mineos.mc(server_name, BASE_DIR);

  async.series([
    async.apply(instance.create, OWNER_CREDS),
    async.apply(instance.modify_sc, 'java', 'jarfile', 'pocketmine.phar'),
    function(callback) {
      instance.property('ping', function(err, pingback) {
        test.ifError(!err); //expected error
        test.equal(pingback, null);
        callback(!err);
      })
    }
  ], function(err) {
    test.ifError(err);
    test.done();
  })
}

test.query = function(test) {
  var server_name = 'testing';
  var instance = new mineos.mc(server_name, BASE_DIR);

  async.series([
    async.apply(instance.create, OWNER_CREDS),
    async.apply(instance.modify_sc, 'minecraft', 'profile', '1.7.9'),
    async.apply(instance.modify_sc, 'java', 'jarfile', 'minecraft_server.1.7.9.jar'),
    async.apply(instance.copy_profile),
    function(callback) {
      instance.query(function(err, pingback) {
        test.ifError(err);
        test.equal(Object.keys(pingback).length, 0);
        callback();
      })
    },
    async.apply(instance.start),
    function(callback) {
      setTimeout(function() {
        instance.query(function(err, pingback) {
          test.ifError(err);
          test.equal(Object.keys(pingback).length, 0);
          callback(err);
        })
      }, 16000)
    },
    async.apply(instance.kill),
    async.apply(instance.modify_sp, 'enable-query', 'true'),
    async.apply(instance.start),
    function(callback) {
      setTimeout(function() {
        instance.query(function(err, pingback) {
          test.ifError(err);
          test.equal(pingback.hostname, 'A Minecraft Server');
          test.equal(pingback.gametype, 'SMP');
          test.equal(pingback.game_id, 'MINECRAFT');
          test.equal(pingback.version, '1.7.9');
          test.equal(pingback.plugins, '');
          test.equal(pingback.map, 'world');
          test.equal(pingback.numplayers, '0');
          test.equal(pingback.maxplayers, '20');
          test.equal(pingback.hostport, '25565');
          test.equal(pingback.player_.length, 0);
          callback(err);
        })
      }, 6000)
    },
    async.apply(instance.kill)
  ], function(err) {
    test.ifError(err);
    test.done();
  })
}

test.memory = function(test) {
  var server_name = 'testing';
  var instance = new mineos.mc(server_name, BASE_DIR);
  var memory_regex = /(\d+) kB/

  async.series([
    async.apply(instance.create, OWNER_CREDS),
    async.apply(instance.modify_sc, 'minecraft', 'profile', '1.7.9'),
    async.apply(instance.modify_sc, 'java', 'jarfile', 'minecraft_server.1.7.9.jar'),
    async.apply(instance.copy_profile),
    async.apply(instance.start),
    function(callback) {
      instance.property('memory', function(err, memory_obj) {
        test.ifError(err);
        test.equal(memory_obj.Name, 'java');
        //test.ok(memory_regex.test(memory_obj.VmPeak)); //not used, fails freebsd
        test.ok(memory_regex.test(memory_obj.VmSize));
        test.ok(memory_regex.test(memory_obj.VmRSS));
        //test.ok(memory_regex.test(memory_obj.VmSwap)); //not used, fails freebsd
        callback(err);
      })
    },
    async.apply(instance.kill)
  ], function(err) {
    test.ifError(err);
    test.done();
  })  
}

test.prune = function(test) {
  var server_name = 'testing';
  var instance = new mineos.mc(server_name, BASE_DIR);

  var saved_increment = null;

  async.series([
    async.apply(instance.create, OWNER_CREDS),
    async.apply(instance.modify_sp, 'server-port', 25570),
    function(callback) {
      instance.backup(function() {
        setTimeout(callback, FS_DELAY_MS*5);
      })
    },
    async.apply(instance.modify_sp, 'server-port', 25575),
    function(callback) {
      instance.backup(function() {
        setTimeout(callback, FS_DELAY_MS*5);
      })
    },
    function(callback) {
      instance.list_increments(function(err, increments) {
        test.equal(increments.length, 2);
        test.equal(increments[0].step, '0B');
        test.equal(increments[1].step, '1B');
        saved_increment = increments[0].time;
        setTimeout(function() { callback(err) }, FS_DELAY_MS*5);
      })
    },
    function(callback) {
      instance.prune('0B', function(err) {
        test.ifError(err);
        callback();
      })
    },
    function(callback) {
      instance.list_increments(function(err, increments) {
        test.equal(increments.length, 1);
        test.equal(increments[0].step, '0B');
        test.equal(saved_increment, increments[0].time);
        setTimeout(function() { callback(err) }, FS_DELAY_MS*5);
      })
    }
  ], function(err, results) {
    test.ifError(err);
    test.done();
  })  
}

test.modify_sp = function(test) {
  var server_name = 'testing';
  var instance = new mineos.mc(server_name, BASE_DIR);

  async.series([
    async.apply(instance.create, OWNER_CREDS),
    function(callback) {
      instance.sp(function(err, props) {
        test.ifError(err);
        test.equal(props['server-port'], 25565);
        callback(err);
      })
    },
    async.apply(instance.modify_sp, 'server-port', 25570),
    function(callback) {
      instance.sp(function(err, props) {
        test.ifError(err);
        test.equal(props['server-port'], 25570);
        callback(err);
      })
    }
  ], function(err, results) {
    test.ifError(err);
    test.expect(5);
    test.done();
  })  
}

test.list_archive = function(test) {
  var server_name = 'testing';
  var instance = new mineos.mc(server_name, BASE_DIR);

  async.series([
    function(callback) {
      instance.list_archives(function(err, archives) {
        test.ifError(!err);
        test.equal(archives.length, 0);
        callback(!err);
      })
    },
    async.apply(instance.create, OWNER_CREDS),
    async.apply(instance.archive),
    function(callback) {
      setTimeout(function() {callback()}, 1000);
    },
    async.apply(instance.archive),
    function(callback) {
      instance.list_archives(function(err, archives) {
        test.ifError(err);
        test.equal(archives.length, 2);
        callback(err);
      })
    }
  ], function(err, results) {
    test.ifError(err);
    test.expect(5);
    test.done();
  })  
}

test.delete_archive = function(test) {
  var server_name = 'testing';
  var instance = new mineos.mc(server_name, BASE_DIR);

  async.waterfall([
    function(callback) {
      instance.create(OWNER_CREDS, function(err) {
        test.ifError(err);
        callback(err);
      })
    },
    function(callback) {
      instance.archive(function(err) {
        test.ifError(err);
        setTimeout(function() { callback(err) }, FS_DELAY_MS*6);
      })
    },
    function(callback) {
      instance.archive(function(err) {
        test.ifError(err);
        setTimeout(function() { callback(err) }, FS_DELAY_MS*5);
      })
    },
    function(callback) {
      instance.list_archives(function(err, archives) {
        test.ifError(err);
        test.equal(archives.length, 2);
        callback(err, archives[1].filename, archives[0].filename);
      })
    },
    function(archive_to_delete, archive_to_remain, callback) {
      instance.delete_archive(archive_to_delete, function(err) {
        test.ifError(err);
        callback(err, archive_to_remain);
      })
    },
    function(archive_to_remain, callback) {
      instance.list_archives(function(err, archives) {
        test.ifError(err);
        test.equal(archives[0].filename, archive_to_remain);
        test.equal(archives.length, 1);
        callback(err);
      })
    }
  ], function(err, results) {
    test.ifError(err);
    test.expect(10);
    test.done();
  })  
}

test.previous_version = function(test) {
  var ini = require('ini');
  
  var server_name = 'testing';
  var instance = new mineos.mc(server_name, BASE_DIR);

  async.series([
    async.apply(instance.create, OWNER_CREDS),
    function(callback) {
      instance.backup(function(err) {
        test.ifError(err);
        setTimeout(function() { callback(err) }, FS_DELAY_MS*5);
      })
    },
    function(callback) {
      instance.modify_sp('server-port', 25570, function(err) {
        test.ifError(err);
        callback(err);
      })
    },
    function(callback) {
      instance.previous_version('server.properties', '0B', function(err, file_contents) {
        var decoded = ini.decode(file_contents);
        test.equal(decoded['server-port'], 25565); 
        callback(err);
      })
    },
    function(callback) {
      instance.backup(function(err) {
        test.ifError(err);
        setTimeout(function() { callback(err) }, FS_DELAY_MS*5);
      })
    },
    function(callback) {
      instance.previous_version('server.properties', '1B', function(err, file_contents) {
        var decoded = ini.decode(file_contents);
        test.equal(decoded['server-port'], 25565); 
        callback(err);
      })
    }
  ], function(err, results) {
    test.ifError(err);
    test.expect(6);
    test.done();
  }) 
}

test.previous_property = function(test) {
  var server_name = 'testing';
  var instance = new mineos.mc(server_name, BASE_DIR);

  async.series([
    async.apply(instance.create, OWNER_CREDS),
    function(callback) {
      instance.previous_property('1B', function(err, psp) {
        test.ifError(!err); //testing for error
        test.equal(psp, null);
        callback(!err);
      })
    },
    function(callback) {
      instance.backup(function(err) {
        test.ifError(err);
        setTimeout(function() { callback(err) }, FS_DELAY_MS*3);
      })
    },
    function(callback) {
      instance.modify_sp('server-port', 25570, function(err) {
        test.ifError(err);
        callback(err);
      })
    },
    function(callback) {
      instance.previous_property('0B', function(err, psp) {
        test.ifError(err);
        test.equal(psp['server-port'], '25565');
        callback(err);
      })
    }
  ], function(err, results) {
    test.ifError(err);
    test.expect(7);
    test.done();
  })
}

test.stuff = function(test) {
  var server_name = 'testing';
  var instance = new mineos.mc(server_name, BASE_DIR);

  async.series([
    function(callback) {
      instance.stuff('op hexparrot', function(err, proc) {
        test.ok(err); //looking for positive error
        callback(!err);
      })
    },
    async.apply(instance.create, OWNER_CREDS),
    function(callback) {
      instance.stuff('op hexparrot', function(err, proc) {
        test.ok(err); //looking for positive error
        callback(!err);
      })
    },
    async.apply(instance.modify_sc, 'minecraft', 'profile', '1.7.9'),
    async.apply(instance.modify_sc, 'java', 'jarfile', 'minecraft_server.1.7.9.jar'),
    async.apply(instance.copy_profile),
    async.apply(instance.start),
    function(callback) {
      setTimeout(callback, 20000);
    },
    async.apply(instance.stuff, 'op hexparrot'),
    async.apply(instance.kill)
  ], function(err) {
    test.ifError(err);
    test.expect(3);
    test.done();
  })
}

test.check_eula = function(test) {
  var server_name = 'testing';
  var instance = new mineos.mc(server_name, BASE_DIR);

  async.waterfall([
    async.apply(instance.create, OWNER_CREDS),
    function(throwaway, cb) { cb() }, //discards instance.create return so cb arguments line up below
    async.apply(instance.property, 'eula'),
    function(eula_value, cb) {
      test.equal(eula_value, undefined);
      cb();
    },
    async.apply(fs.outputFile, path.join(instance.env.cwd, 'eula.txt'), '//here is something\neula=false\n'),
    async.apply(instance.property, 'eula'),
    function(eula_value, cb) {
      test.equal(eula_value, false);
      cb();
    },
    async.apply(fs.outputFile, path.join(instance.env.cwd, 'eula.txt'), '//here is something\neula=true\n'),
    async.apply(instance.property, 'eula'),
    function(eula_value, cb) {
      test.equal(eula_value, true);
      cb();
    },
    async.apply(fs.outputFile, path.join(instance.env.cwd, 'eula.txt'), '//here is something\neula = false\n'),
    async.apply(instance.property, 'eula'),
    function(eula_value, cb) {
      test.equal(eula_value, false);
      cb();
    },
    async.apply(fs.outputFile, path.join(instance.env.cwd, 'eula.txt'), '//here is something\neula = true\n'),
    async.apply(instance.property, 'eula'),
    function(eula_value, cb) {
      test.equal(eula_value, true);
      cb();
    },
    async.apply(fs.outputFile, path.join(instance.env.cwd, 'eula.txt'), '//here is something\neula = FALSE\n'),
    async.apply(instance.property, 'eula'),
    function(eula_value, cb) {
      test.equal(eula_value, false);
      cb();
    },
    async.apply(fs.outputFile, path.join(instance.env.cwd, 'eula.txt'), '//here is something\neula = TRUE\n'),
    async.apply(instance.property, 'eula'),
    function(eula_value, cb) {
      test.equal(eula_value, true);
      cb();
    },
    async.apply(fs.outputFile, path.join(instance.env.cwd, 'eula.txt'), '//here is something\neula = fals\n'),
    async.apply(instance.property, 'eula'),
    function(eula_value, cb) {
      test.equal(eula_value, false);
      cb();
    },
    async.apply(fs.outputFile, path.join(instance.env.cwd, 'eula.txt'), '//here is something\neula = tru\n'),
    async.apply(instance.property, 'eula'),
    function(eula_value, cb) {
      test.equal(eula_value, false);
      cb();
    },
    async.apply(fs.outputFile, path.join(instance.env.cwd, 'eula.txt'), '//here is something\n//heres more irrelevant lines\n'),
    async.apply(instance.property, 'eula'),
    function(eula_value, cb) {
      test.equal(eula_value, false);
      cb();
    }
  ], function(err) {
    test.done();
  })
}

test.accept_eula = function(test) {
  var server_name = 'testing';
  var instance = new mineos.mc(server_name, BASE_DIR);

  async.waterfall([
    async.apply(instance.create, OWNER_CREDS),
    async.apply(fs.outputFile, path.join(instance.env.cwd, 'eula.txt'), 'eula=false'),
    async.apply(instance.property, 'eula'),
    function(eula_value, cb) {
      test.equal(eula_value, false);
      cb();
    },
    async.apply(instance.accept_eula),
    async.apply(instance.property, 'eula'),
    function(eula_value, cb) {
      test.equal(eula_value, true);
      cb();
    }
  ], function(err) {
    test.done();
  })
}

test.chown = function(test) {
  var userid = require('userid');

  var server_name = 'testing';
  var instance = new mineos.mc(server_name, BASE_DIR);

  var NEW_OWNER_CREDS = {
    uid: 1001,
    gid: 1001
  }

  if (userid.uid(process.env.USER) != 0) {
    NEW_OWNER_CREDS = {
      uid: userid.uid(process.env.USER),
      gid: userid.uid(process.env.USER)
    }
  }

  async.series([
    async.apply(instance.create, OWNER_CREDS),
    function(callback) {
      instance.property('owner', function(err, result) {
        test.ifError(err);
        test.equal(OWNER_CREDS['uid'], result['uid']);
        test.equal(OWNER_CREDS['gid'], result['gid']);
        callback(err);
      })
    },
    async.apply(instance.chown, NEW_OWNER_CREDS.uid, NEW_OWNER_CREDS.gid),
    function(callback) {
      instance.property('owner', function(err, result) {
        test.ifError(err);
        test.equal(NEW_OWNER_CREDS['uid'], result['uid']);
        test.equal(NEW_OWNER_CREDS['gid'], result['gid']);
        callback(err);
      })
    },
    function(callback) {
      instance.chown(8877, 8877, function(err) {
        test.ifError(!err);
        callback(!err);
      })
    },
    function(callback) {
      instance.property('owner', function(err, result) {
        test.ifError(err);
        test.equal(NEW_OWNER_CREDS['uid'], result['uid']);
        test.equal(NEW_OWNER_CREDS['gid'], result['gid']);
        callback(err);
      })
    },

  ], function(err) {
    test.ifError(err);
    test.done();
  })
}

test.chown_recursive = function(test) {
  var userid = require('userid');

  var server_name = 'testing';
  var instance = new mineos.mc(server_name, BASE_DIR);

  var NEW_OWNER_CREDS = {
    uid: 1001,
    gid: 1001
  }

  if (userid.uid(process.env.USER) != 0) {
    NEW_OWNER_CREDS = {
      uid: userid.uid(process.env.USER),
      gid: userid.uid(process.env.USER)
    }
  }

  var newfile = path.join(instance.env.cwd, 'newfile');

  async.series([
    async.apply(instance.create, OWNER_CREDS),
    async.apply(fs.open, newfile, 'w'),
    async.apply(fs.chown, newfile, OWNER_CREDS.uid, OWNER_CREDS.gid),
    function(callback) {
      fs.readdir(instance.env.cwd, function(err, files) {
        for (var i=0; i<files.length; i++) {
          var fp = path.join(instance.env.cwd, files[i]);

          test.equal(fs.statSync(fp).uid, OWNER_CREDS.uid);
          test.equal(fs.statSync(fp).gid, OWNER_CREDS.gid);
        }
        callback();
      });
    },
    function(callback) {
      instance.chown(NEW_OWNER_CREDS.uid, NEW_OWNER_CREDS.gid, function(err) {
        test.ifError(err);
        callback(err);
      })
    },
    function(callback) {

      fs.readdir(instance.env.cwd, function(err, files) {
        for (var i=0; i<files.length; i++) {
          var fp = path.join(instance.env.cwd, files[i]);

          test.equal(fs.statSync(fp).uid, NEW_OWNER_CREDS.uid);
          test.equal(fs.statSync(fp).gid, NEW_OWNER_CREDS.gid);
        }
        callback();
      });
    }
  ], function(err) {
    test.ifError(err);
    test.done();
  })
}

test.sync_chown = function(test) {
  var userid = require('userid');

  var server_name = 'testing';
  var server_path = path.join(BASE_DIR, mineos.DIRS['servers'], server_name);
  var instance = new mineos.mc(server_name, BASE_DIR);

  async.series([
    async.apply(fs.ensureDir, server_path),
    async.apply(fs.chown, server_path, OWNER_CREDS.uid, OWNER_CREDS.gid),
    function(callback) {
      test.equal(fs.statSync(instance.env.cwd).uid, OWNER_CREDS.uid);
      test.equal(fs.statSync(instance.env.cwd).gid, OWNER_CREDS.gid);
      callback();
    },
    async.apply(instance.sync_chown),
    function(callback) {
      test.equal(fs.statSync(instance.env.cwd).uid, OWNER_CREDS.uid);
      test.equal(fs.statSync(instance.env.cwd).gid, OWNER_CREDS.gid);

      test.equal(fs.statSync(instance.env.bwd).uid, OWNER_CREDS.uid);
      test.equal(fs.statSync(instance.env.bwd).gid, OWNER_CREDS.gid);

      test.equal(fs.statSync(instance.env.awd).uid, OWNER_CREDS.uid);
      test.equal(fs.statSync(instance.env.awd).gid, OWNER_CREDS.gid);
      callback();
    }
  ], function(err) {
    test.ifError(err);
    test.done();
  })
}

test.broadcast_property = function(test) {
  var server_name = 'testing';
  var instance = new mineos.mc(server_name, BASE_DIR);

  async.series([
    async.apply(instance.create, OWNER_CREDS),
    function(callback) {
      instance.property('broadcast', function(err, will_broadcast) {
        test.ifError(err);
        test.ok(!will_broadcast);
        callback(err);
      })
    },
    async.apply(instance.modify_sc, 'minecraft', 'broadcast', 'true'),
    function(callback) {
      instance.property('broadcast', function(err, will_broadcast) {
        test.ifError(err);
        test.ok(true);
        callback(err);
      })
    }
  ], function(err) {
    test.ifError(err);
    test.done();
  })
}

test.server_files_property = function(test) {
  var server_name = 'testing';
  var instance = new mineos.mc(server_name, BASE_DIR);

  async.series([
    function(callback) {
      instance.property('server_files', function(err, server_files) {
        test.ifError(!err);
        test.equal(server_files.length, 0);
        callback(!err);
      })
    },
    async.apply(instance.create, OWNER_CREDS),
    function(callback) {
      instance.property('server_files', function(err, server_files) {
        test.ifError(err);
        test.equal(server_files.length, 0);
        callback(err);
      })
    },
    async.apply(fs.ensureFile, path.join(instance.env.cwd, 'myserver.jar')),
    function(callback) {
      instance.property('server_files', function(err, server_files) {
        test.ifError(err);
        test.equal(server_files.length, 1);
        test.ok(server_files.indexOf('myserver.jar') >= 0);
        callback(err);
      })
    },
    async.apply(instance.modify_sc, 'minecraft', 'profile', '1.7.9'),
    function(callback) {
      instance.property('server_files', function(err, server_files) {
        test.ifError(err);
        test.equal(server_files.length, 2);
        test.ok(server_files.indexOf('myserver.jar') >= 0);
        test.ok(server_files.indexOf('minecraft_server.1.7.9.jar') >= 0);
        callback(err);
      })
    },
    async.apply(instance.copy_profile),
    function(callback) {
      instance.property('server_files', function(err, server_files) {
        test.ifError(err);
        test.equal(server_files.length, 2);
        test.ok(server_files.indexOf('myserver.jar') >= 0);
        test.ok(server_files.indexOf('minecraft_server.1.7.9.jar') >= 0);
        callback(err);
      })
    },
    async.apply(fs.ensureFile, path.join(instance.env.cwd, 'pocket.phar')),
    function(callback) {
      instance.property('server_files', function(err, server_files) {
        test.ifError(err);
        test.equal(server_files.length, 3);
        test.ok(server_files.indexOf('myserver.jar') >= 0);
        test.ok(server_files.indexOf('pocket.phar') >= 0);
        test.ok(server_files.indexOf('minecraft_server.1.7.9.jar') >= 0);
        callback(err);
      })
    },
    async.apply(fs.ensureFile, path.join(instance.env.cwd, 'pocket.PHAR')),
    function(callback) {
      instance.property('server_files', function(err, server_files) {
        test.ifError(err);
        test.equal(server_files.length, 4);
        test.ok(server_files.indexOf('myserver.jar') >= 0);
        test.ok(server_files.indexOf('pocket.phar') >= 0);
        test.ok(server_files.indexOf('pocket.PHAR') >= 0);
        test.ok(server_files.indexOf('minecraft_server.1.7.9.jar') >= 0);
        callback(err);
      })
    },
    async.apply(fs.ensureFile, path.join(instance.env.cwd, 'another.JAR')),
    function(callback) {
      instance.property('server_files', function(err, server_files) {
        test.ifError(err);
        test.equal(server_files.length, 5);
        test.ok(server_files.indexOf('myserver.jar') >= 0);
        test.ok(server_files.indexOf('pocket.phar') >= 0);
        test.ok(server_files.indexOf('pocket.PHAR') >= 0);
        test.ok(server_files.indexOf('minecraft_server.1.7.9.jar') >= 0);
        test.ok(server_files.indexOf('another.JAR') >= 0);
        callback(err);
      })
    },
    async.apply(instance.modify_sc, 'minecraft', 'profile', ''),
    function(callback) {
      instance.property('server_files', function(err, server_files) {
        test.ifError(err);
        test.equal(server_files.length, 5);
        test.ok(server_files.indexOf('myserver.jar') >= 0);
        test.ok(server_files.indexOf('pocket.phar') >= 0);
        test.ok(server_files.indexOf('pocket.PHAR') >= 0);
        test.ok(server_files.indexOf('minecraft_server.1.7.9.jar') >= 0);
        test.ok(server_files.indexOf('another.JAR') >= 0);
        callback(err);
      })
    }
  ], function(err) {
    test.ifError(err);
    test.done();
  })
}

test.copy_profile = function(test) {
  var server_name = 'testing';
  var instance = new mineos.mc(server_name, BASE_DIR);
  var jar_filepath = path.join(instance.env.cwd, 'minecraft_server.1.7.9.jar')

  async.series([
    async.apply(instance.create, OWNER_CREDS),
    async.apply(instance.copy_profile),
    function(callback) {
      fs.stat(jar_filepath, function(err) {
        test.ifError(!err);
        callback(!err);
      })
    },
    async.apply(instance.modify_sc, 'minecraft', 'profile', '1.7.9'),
    async.apply(instance.modify_sc, 'java', 'jarfile', 'minecraft_server.1.7.9.jar'),
    async.apply(instance.copy_profile),
    async.apply(fs.stat, jar_filepath),
    async.apply(instance.modify_sc, 'minecraft', 'profile', 'madeupprofile'),
    function(callback) {
      instance.copy_profile(function(err) {
        test.equal(err, 23); // [Error: rsync exited with code 23] (for source dir not existing)
        callback();
      })
    },
    function(callback) {
      test.equal(oct2dec(fs.statSync(path.join(instance.env.cwd, 'minecraft_server.1.7.9.jar')).mode), 664);
      callback();
    }
  ], function(err) {
    test.ifError(err);
    test.done();
  })
}

test.eula_false = function(test) {
  var server_name = 'testing';
  var instance = new mineos.mc(server_name, BASE_DIR);

  async.series([
    async.apply(instance.create, OWNER_CREDS),
    function(callback) {
      instance.property('eula', function(err, eula_value) {
        test.ifError(err);
        test.equal(eula_value, undefined);
        callback(err);
      })
    },
    async.apply(fs.outputFile, path.join(instance.env.cwd, 'eula.txt'), 'eula=true'),
    function(callback) {
      instance.property('eula', function(err, eula_value) {
        test.ifError(err);
        test.ok(eula_value);
        callback(err);
      })
    },
    async.apply(instance.verify, 'eula'),
    async.apply(fs.outputFile, path.join(instance.env.cwd, 'eula.txt'), 'eula=false'),
    function(callback) {
      instance.property('eula', function(err, eula_value) {
        test.ifError(err);
        test.ok(!eula_value);
        callback(err);
      })
    }
  ], function(err) {
    test.ifError(err);
    test.done();
  })
}

test.crons = function(test) {
  var hash = require('object-hash');

  var server_name = 'testing';
  var instance = new mineos.mc(server_name, BASE_DIR);

  var cron_def1 = {
    action: 'stuff',
    source: '* * * * * *',
    msg: 'hello everybody'
  }

  var cron_def2 = {
    action: 'stuff',
    source: '* * * * * *',
    msg: 'killing everything!'
  }

  var cron_hash1 = hash(cron_def1);
  var cron_hash2 = hash(cron_def2);

  async.series([
    async.apply(instance.create, OWNER_CREDS),
    async.apply(instance.add_cron, cron_hash1, cron_def1),
    function(callback) {
      instance.crons(function(err, dict) {
        test.ifError(err);
        test.equal(dict[cron_hash1].action, cron_def1.action);
        test.equal(dict[cron_hash1].source, cron_def1.source);
        test.equal(dict[cron_hash1].msg, cron_def1.msg);
        callback(err);
      })
    },
    async.apply(instance.add_cron, hash(cron_def2), cron_def2),
    function(callback) {
      instance.crons(function(err, dict) {
        test.ifError(err);
        test.equal(dict[cron_hash2].action, cron_def2.action);
        test.equal(dict[cron_hash2].source, cron_def2.source);
        test.equal(dict[cron_hash2].msg, cron_def2.msg);
        callback(err);
      })
    },
    async.apply(instance.delete_cron, cron_hash2),
    function(callback) {
      instance.crons(function(err, dict) {
        test.ifError(err);
        test.equal(cron_hash1 in dict, true);
        test.equal(cron_hash2 in dict, false);
        test.equal(Object.keys(dict).length, 1);
        callback(err);
      })
    },
    function(callback) {
      instance.crons(function(err, dict) {
        test.ifError(err);
        test.equal(cron_hash1 in dict, true);
        test.equal(dict[cron_hash1].enabled, false);
        callback(err);
      })
    },
    async.apply(instance.set_cron, cron_hash1, true),
    function(callback) {
      instance.crons(function(err, dict) {
        test.ifError(err);
        test.equal(cron_hash1 in dict, true);
        test.equal(dict[cron_hash1].enabled, true);
        callback(err);
      })
    },
    async.apply(instance.set_cron, cron_hash1, false),
    function(callback) {
      instance.crons(function(err, dict) {
        test.ifError(err);
        test.equal(cron_hash1 in dict, true);
        test.equal(dict[cron_hash1].enabled, false);
        callback(err);
      })
    }
  ], function(err) {
    test.ifError(err);
    test.done();
  })
}

test.create_server_from_awd = function(test) {
  var server_name = 'testing';
  var temporary_instance = new mineos.mc(server_name, BASE_DIR);
  var new_instance = new mineos.mc('testing_server_2', BASE_DIR);

  var archive_filepath = null;

  async.series([
    async.apply(temporary_instance.create, OWNER_CREDS),
    function(callback) {
      var servers = mineos.server_list(BASE_DIR);
      test.equal(servers.length, 1);
      callback();
    },
    async.apply(temporary_instance.modify_sc, 'java', 'java_xmx', '1024'),
    function(callback) {
      temporary_instance.sc(function(err, dict) {
        test.ifError(err);
        test.equal(dict.java.java_xmx, '1024');
        callback(err);
      })
    },
    async.apply(temporary_instance.archive),
    function(callback) {
      var created_archive = fs.readdirSync(temporary_instance.env.awd)[0];
      archive_filepath = path.join(temporary_instance.env.awd, created_archive);
      callback(null);
    },
    function(callback) {
      new_instance.create_from_archive(OWNER_CREDS, archive_filepath, function(err) {
        callback(err);
      })
    },
    function(callback) {
      new_instance.sc(function(err, dict) {
        test.ifError(err);
        test.equal(dict.java.java_xmx, '1024');
        callback(err);
      })
    },
    function(callback) {
      var servers = mineos.server_list(BASE_DIR);
      test.equal(servers.length, 2);
      test.ok(servers.indexOf('testing') >= 0);
      test.ok(servers.indexOf('testing_server_2') >= 0);
      callback();
    },
    function(callback) {
      new_instance.create_from_archive(OWNER_CREDS, archive_filepath, function(err){
        test.ifError(!err);
        callback(!err);
      });
    },
    function(callback) {
      async.parallel([
        async.apply(fs.stat, new_instance.env.sp),
        async.apply(fs.stat, new_instance.env.sc),
        async.apply(fs.stat, new_instance.env.cc),
        async.apply(fs.stat, new_instance.env.bwd),
        async.apply(fs.stat, new_instance.env.awd)
      ], callback)
    },
    function(callback) {
      new_instance.property('owner', function(err, result) {
        test.ifError(err);
        test.equal(OWNER_CREDS['uid'], result['uid']);
        test.equal(OWNER_CREDS['gid'], result['gid']);
        callback(err);
      })
    }
  ], function(err) {
    test.ifError(err);
    test.done();
  })
}

test.create_server_from_awd_zip = function(test) {
  var server_name = 'testing';
  var instance = new mineos.mc(server_name, BASE_DIR);

  var archive_filepath = 'BTeam_Server_v1.0.12a.zip';

  async.series([
    function(callback) {
      instance.create_from_archive(OWNER_CREDS, archive_filepath, function(err) {
        var files = fs.readdirSync(instance.env.base_dir);
        callback();
      })
    },
    function(callback) {
      async.parallel([
        async.apply(fs.stat, instance.env.sp),
        async.apply(fs.stat, instance.env.sc),
        async.apply(fs.stat, instance.env.cc),
        async.apply(fs.stat, instance.env.bwd),
        async.apply(fs.stat, instance.env.awd)
      ], callback)
    },
    function(callback) {
      instance.property('owner', function(err, result) {
        test.ifError(err);
        test.equal(OWNER_CREDS['uid'], result['uid']);
        test.equal(OWNER_CREDS['gid'], result['gid']);
        callback(err);
      })
    },
    function(callback) {
      var files = fs.readdirSync(instance.env.cwd);
      for (var i in files) {
        var filepath = path.join(instance.env.cwd, files[i]);
        var filestat = fs.statSync(filepath);

        test.equal(OWNER_CREDS['uid'], filestat['uid']);
        test.equal(OWNER_CREDS['gid'], filestat['gid']);
      }
      callback();
    }
  ], function(err) {
    test.ifError(err);
    test.done();
  })
}

test.profile_delta = function(test) {
  var server_name = 'testing';
  var instance = new mineos.mc(server_name, BASE_DIR);

  async.series([
    async.apply(instance.create, OWNER_CREDS),
    function(callback) {
      instance.profile_delta('1.7.9', function(err, profile_delta) {
        test.ifError(err);
        test.equal(profile_delta.length, 1);
        test.equal(profile_delta[0], 'minecraft_server.1.7.9.jar');
        callback(err);
      })
    },
    async.apply(instance.modify_sc, 'minecraft', 'profile', '1.7.9'),
    async.apply(instance.copy_profile),
    function(callback) {
      instance.profile_delta('1.7.9', function(err, profile_delta) {
        test.ifError(err);
        test.equal(profile_delta.length, 0);
        callback(err);
      })
    },
    function(callback) {
      instance.profile_delta('madeupprofile', function(err, profile_delta) {
        test.equal(err, 23); // [Error: rsync exited with code 23] (for source dir not existing)
        callback();
      })
    }
  ], function(err) {
    test.ifError(err);
    test.done();
  })
}

test.onreboot = function(test) {
  var server_name = 'testing';
  var instance = new mineos.mc(server_name, BASE_DIR);

  async.series([
    async.apply(instance.create, OWNER_CREDS),
    function(callback) {
      instance.property('onreboot_start', function(err, val) {
        test.ifError(err);
        test.equal(val, false);
        callback(err);
      })
    },
    async.apply(instance.modify_sc, 'onreboot', 'start', 'false'),
    function(callback) {
      instance.property('onreboot_start', function(err, val) {
        test.ifError(err);
        test.equal(val, false);
        callback(err);
      })
    },
    async.apply(instance.modify_sc, 'onreboot', 'start', 'true'),
    function(callback) {
      instance.property('onreboot_start', function(err, val) {
        test.ifError(err);
        test.equal(val, true);
        callback(err);
      })
    },
    async.apply(instance.modify_sc, 'onreboot', 'start', true),
    function(callback) {
      instance.property('onreboot_start', function(err, val) {
        test.ifError(err);
        test.equal(val, true);
        callback(err);
      })
    },
    async.apply(instance.modify_sc, 'onreboot', 'start', false),
    function(callback) {
      instance.property('onreboot_start', function(err, val) {
        test.ifError(err);
        test.equal(val, false);
        callback(err);
      })
    }
  ], function(err) {
    test.ifError(err);
    test.done();
  })
}

test.list_increments = function(test) {
  var server_name = 'testing';
  var instance = new mineos.mc(server_name, BASE_DIR);

  async.series([
    function(callback) {
      instance.list_increments(function(err, increments) {
        test.ok(err); // testing for error
        callback(!err);
      })
    },
    async.apply(instance.create, OWNER_CREDS),
    function(callback) {
      instance.list_increments(function(err, increments) {
        test.ok(err); // testing for error
        callback(!err);
      })
    },
    function(callback) {
      instance.backup(function() {
        setTimeout(callback, FS_DELAY_MS*5);
      })
    },
    function(callback) {
      instance.modify_sp('server-port', 25570, function() {
        setTimeout(callback, FS_DELAY_MS*5);
      })
    },
    async.apply(instance.modify_sp, 'server-port', 25570),
    function(callback) {
      instance.backup(function() {
        setTimeout(callback, FS_DELAY_MS*5);
      })
    },
    function(callback) {
      instance.list_increments(function(err, increments) {
        test.equal(increments[0].step, '0B');
        test.equal(increments[1].step, '1B');
        for (var i in increments) {
          test.ok('step' in increments[i]);
          test.ok('time' in increments[i]);
          test.ok('size' in increments[i]);
          test.ok('cum' in increments[i]);
        }
        setTimeout(function() { callback(err) }, FS_DELAY_MS*3);
      })
    }
  ], function(err, results) {
    test.ifError(err);
    test.expect(13);
    test.done();
  })  
}

test.create_unconventional_server = function(test) {
  var server_name = 'testing';
  var instance = new mineos.mc(server_name, BASE_DIR);

  test.equal(mineos.server_list(BASE_DIR).length, 0);

  async.series([
    async.apply(instance.create_unconventional_server, OWNER_CREDS),
    async.apply(fs.stat, instance.env.cwd),
    async.apply(fs.stat, instance.env.bwd),
    async.apply(fs.stat, instance.env.awd),
    async.apply(fs.stat, instance.env.sp),
    async.apply(fs.stat, instance.env.sc),
    async.apply(fs.stat, instance.env.cc),
    function(callback) {
      test.equal(fs.statSync(instance.env.cwd).uid, OWNER_CREDS['uid']);
      test.equal(fs.statSync(instance.env.bwd).uid, OWNER_CREDS['uid']);
      test.equal(fs.statSync(instance.env.awd).uid, OWNER_CREDS['uid']);
      test.equal(fs.statSync(instance.env.sp).uid, OWNER_CREDS['uid']);
      test.equal(fs.statSync(instance.env.sc).uid, OWNER_CREDS['uid']);
      test.equal(fs.statSync(instance.env.cc).uid, OWNER_CREDS['uid']);

      test.equal(fs.statSync(instance.env.cwd).gid, OWNER_CREDS['gid']);
      test.equal(fs.statSync(instance.env.bwd).gid, OWNER_CREDS['gid']);
      test.equal(fs.statSync(instance.env.awd).gid, OWNER_CREDS['gid']);
      test.equal(fs.statSync(instance.env.sp).gid, OWNER_CREDS['gid']);
      test.equal(fs.statSync(instance.env.sc).gid, OWNER_CREDS['gid']);
      test.equal(fs.statSync(instance.env.cc).gid, OWNER_CREDS['gid']);

      test.equal(oct2dec(fs.statSync(instance.env.sp).mode), 664);
      test.equal(oct2dec(fs.statSync(instance.env.sc).mode), 664);
      test.equal(oct2dec(fs.statSync(instance.env.cc).mode), 664);

      test.equal(mineos.server_list(BASE_DIR)[0], server_name);
      test.equal(mineos.server_list(BASE_DIR).length, 1);

      instance.sc(function(err, dict) {
        test.equal(Object.keys(dict).length, 1);
        test.equal(dict.minecraft.unconventional, true);
      })

      instance.sp(function(err, dict) {
        test.equal(Object.keys(dict).length, 0);
      })

      callback();
    },
    function(callback) {
      instance.create_unconventional_server(OWNER_CREDS, function(err){
        test.ifError(!err);
        callback(!err);
      })
    }
  ], function(err) {
    test.ifError(err);
    test.done();
  })
}
var path = require('path');
var fs = require('fs-extra');
var async = require('async');
var userid = require('userid');
var whoami = require('whoami');
var mineos = require('../mineos');
var server = require('../server');
var events = require('events');
var test = exports;
var BASE_DIR = '/var/games/minecraft';

test.setUp = function(callback) {
  fs.removeSync(BASE_DIR);
  callback();
}

test.tearDown = function(callback) {
  callback();
}

test.start_backend = function(test) {
  async.waterfall([
    function(cb) {
      fs.stat(BASE_DIR, function(err) {
        test.equal(err.code, 'ENOENT');
        test.ok(err);
        cb(!err);
      })
    }
  ])

  var be = server.backend(BASE_DIR, new events.EventEmitter);

  async.waterfall([
    function(cb) {
      fs.stat(BASE_DIR, function(err) {
        test.ifError(err);
        cb(err);
      })
    }
  ])

  test.ok(be.servers instanceof Object);
  test.ok(be.front_end instanceof events.EventEmitter);

  be.shutdown();
  test.done();
}
[program:mineos]
command=/usr/bin/node webui.js
directory=/usr/games/minecraft
user=root
autostart=true
autorestart=true
redirect_stderr=true
[program:mineos]
command=/usr/local/bin/node webui.js
directory=/usr/local/games/minecraft
autostart=true
autorestart=true
redirect_stderr=true
environment=PATH="/usr/local/bin:%(ENV_PATH)s"
[Unit]
Description=Start MineOS minecraft front-end
After=network.target

[Service]
User=root
WorkingDirectory=/usr/games/minecraft
Type=forking
ExecStart=/usr/bin/node service.js start
ExecStop=/usr/bin/node service.js stop
ExecReload=/usr/bin/node service.js restart
PIDFile=/var/run/mineos.pid
Restart=always

[Install]
WantedBy=multi-user.target
# mineos - 

description "mineos minecraft front-end"
author "Will Dizon <wdchromium@gmail.com>"

# Stanzas
#
# Stanzas control when and how a process is started and stopped
# See a list of stanzas here: http://upstart.ubuntu.com/wiki/Stanzas#respawn

# When to start the service
start on runlevel [2345]

# When to stop the service
stop on runlevel [016]

# Automatically restart process if crashed
respawn

# Essentially lets upstart know the process will detach itself to the background
expect daemon

# Specify working directory
chdir /usr/games/minecraft

# Start the process
exec sudo -u root /usr/bin/node service.js start


<!DOCTYPE html>
<!--[if lt IE 7]>      <html class="no-js lt-ie9 lt-ie8 lt-ie7"> <![endif]-->
<!--[if IE 7]>         <html class="no-js lt-ie9 lt-ie8"> <![endif]-->
<!--[if IE 8]>         <html class="no-js lt-ie9"> <![endif]-->
<!--[if gt IE 8]><!--> <html class="no-js"> <!--<![endif]-->
<head>
    <!-- START META SECTION -->
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <title>MineOS Web User Interface</title>
    <meta name="description" content="">
    <meta name="viewport" content="width=device-width, user-scalable=0, initial-scale=1.0">
    <!--/ END META SECTION -->

    <!-- START STYLESHEET SECTION -->
    <!-- IMPORTANT! :  All the available plugin will be loaded at once -->
    <!-- Stylesheet(Bootstrap) -->
    <link rel="stylesheet" href="assets/bootstrap/css/bootstrap.min.css">
    <link rel="stylesheet" href="assets/bootstrap/css/bootstrap-responsive.min.css">
    <!--/ Stylesheet(Bootstrap) -->

    <!-- Stylesheet(Application) -->
    <link rel="stylesheet" href="css/style.css">
    <link rel="stylesheet" href="css/custom.css">
    <link rel="stylesheet" id="base-color" href="css/color/serene.css"><!-- Base Theme Color -->
    <link rel="stylesheet" id="base-bg" href="css/background/bg1.css"><!-- Boxed Background -->
    <!--/ Stylesheet(Application) -->

    <!-- Stylesheet(Plugins) -->
    <link rel="stylesheet" href="assets/jui/css/jquery-ui-1.10.3.min.css">
    <link rel="stylesheet" href="assets/select2/css/select2.min.css">
    <link rel="stylesheet" href="assets/formvalidation/validationengine/css/jquery.validationEngine.min.css">
    <link rel="stylesheet" href="assets/fullcalendar/css/fullcalendar.min.css">
    <link rel="stylesheet" href="assets/datatable/css/dataTables-bootstrap.min.css">
    <link rel="stylesheet" href="assets/gritter/css/jquery.gritter.min.css">
    <!--/ Stylesheet(Plugins) -->
    <!--/ END STYLESHEET SECTION -->

    <!-- START JAVASCRIPT SECTION - Load only modernizr script here -->
    <!-- Javascript(Modernizr) -->
    <script src="assets/modernizr/js/modernizr-2.6.2.min.js"></script>
    <!--/ Javascript(Modernizr) -->
    <!--/ END JAVASCRIPT SECTION -->
</head>
<body>
    <!-- START Template Wrapper -->
    <!-- If you want to enable the fixed header, just add `.fixed-header` class to the `#wrapper` div below -->
    <div id="wrapper">
        <!-- START Template Canvas -->
        <div id="canvas">


            <!-- START Content -->
            <div class="container-fluid">
                <!-- START Row -->
                <div class="row-fluid">
                    <!-- START Login Widget Form -->
                    <p>&nbsp;</p>
                    <form class="widget stacked teal widget-login" name="login" method="post" action="/auth">
                        <section class="body">
                            <div class="body-inner">
                                <!-- START Logo -->
                                <div class="logo" align="center">
                                    <a href="#"><img src="img/logo-dark.png"></a>
                                </div>
                                <!--/ END Logo -->
                                
                                <!-- Avatar -->
                                <div class="avatar">
                                    <h5 align="center">Welcome to MineOS!</h5>
                                </div><!--/ Avatar -->

                                <!-- Username -->
                                <div class="control-group">
                                    <div class="controls">
                                        <input type="text" name="username" placeholder="Username" class="span12"><i class="icon-user input-icon"></i>
                                    </div>
                                </div><!--/ Username -->

                                <!-- Password -->
                                <div class="control-group">
                                    <div class="controls">
                                        <input type="text" name="password" placeholder="Password" class="span12" autocomplete="off"><i class="icon-lock input-icon"></i>
                                    </div>
                                </div><!--/ Password -->

                                <!-- Checkbox -->
                                <div class="control-group">
                                    <div class="controls">
                                        <span>
                                            <label class="checkbox">
                                                <input type="checkbox" name="hide"> Hide password <a href="http://www.nngroup.com/articles/stop-password-masking/">&nbsp;(?)</a>
                                            </label>
                                            
                                        </span>
                                    </div>
                                </div><!--/ Checkbox -->
                            </div>
                            <!-- Form Action -->
                            <!-- Place out form `.body-inner` -->
                            <div class="form-actions">
                                <button type="submit" class="btn btn-primary">Login</button>
                            </div>
                            <!--/ Form Action -->
                        </section>
                    </form>
                    <!--/ END Login Widget Form -->
                </div>
                <!--/ END Row -->
            </div>
            <!--/ END Content -->
            
        </div>
        <!--/ END Template Canvas -->
    </div>
    <!--/ END Template Wrapper -->

    <!-- IMPORTANT! : All the available plugin will be loaded at once -->
    <!-- START JAVASCRIPT SECTION - Include at the bottom of the page to reduce load time -->
    <!-- Javascript(Vendors) -->
    <script src="assets/jquery/js/jquery-2.1.4.min.js"></script>
    <script src="assets/jui/js/jquery-ui-1.10.3.min.js"></script>
    <!--/ Javascript(Vendors) -->

    <!-- Javascript(Plugins) -->
    <script src="assets/bootstrap/js/bootstrap.min.js"></script>
    <script src="assets/datatable/js/jquery.dataTables.min.js"></script>
    <script src="assets/datatable/js/dataTables-bootstrap.min.js"></script>
    <script src="assets/easypiechart/js/jquery.easypiechart.min.js"></script>
    <script src="assets/formwizard/js/jquery.formwizard.min.js"></script>
    <script src="assets/fullcalendar/js/fullcalendar.min.js"></script>
    <script src="assets/ie-placeholder/js/jquery.placeholder.min.js"></script>
    <script src="assets/inputmask/js/jquery.inputmask.min.js"></script>
    <script src="assets/select2/js/select2.min.js"></script>
    <script src="assets/sparkline/js/jquery.sparkline.min.js"></script>
    <script src="assets/gritter/js/jquery.gritter.min.js"></script>
    <script src="assets/resize/js/jquery.ba-resize.min.js"></script>

    <!-- Form Validation -->
    <script src="assets/formvalidation/bassistance/js/jquery.validate.min.js"></script>
    <script src="assets/formvalidation/validationengine/js/lang/jquery.validationEngine-en.min.js"></script>
    <script src="assets/formvalidation/validationengine/js/jquery.validationEngine.min.js"></script>

    <!-- Chart -->
    <script src="assets/flot/jquery.flot.min.js"></script>
    <script src="assets/flot/jquery.flot.pie.min.js"></script>
    <script src="assets/flot/jquery.flot.categories.min.js"></script>
    <script src="assets/flot/jquery.flot.tooltip.min.js"></script>
    <script src="assets/flot/jquery.flot.resize.min.js"></script>
    <script src="assets/flot/excanvas.min.js"></script>
    <!--/ Javascript(Plugins) -->

    <!-- Javascript (Application) -->
    <script src="/socket.io/socket.io.js"></script>
    <script src="/moment/min/moment.min.js"></script>
    <script src="/angular/angular.min.js"></script>
    <script src="/angular-translate/angular-translate.min.js"></script>
    <script src="/angular-translate/angular-translate-loader-static-files/angular-translate-loader-static-files.min.js"></script>
    <script src="/angular-moment/angular-moment.min.js"></script>
    <script src="/angular-moment-duration-format/moment-duration-format.js"></script>
    <script src="js/scriptin.js"></script>
    <script src="js/plugins.js"></script>
    <script src="js/application.js"></script>
    <script src="js/easypiechart.sample.js"></script>
    <!--/ Javascript (Application) -->
    <!--/ END JAVASCRIPT SECTION -->

    <script type="text/javascript">
      $(document).ready(function () {
        try {
          $('input[name=password]').attr('type', 'text');
          $('input[name=hide]').on('change', function () {
            if ($(this).is(':checked'))
              $('input[name=password]').attr('type', 'password');
            else
              $('input[name=password]').attr('type', 'text');
          })
        } catch (e) {
          $('input[name=password]').attr('type', 'password');
        }        
      })
    </script>

    </body>
    </html>
    <!DOCTYPE html>
<!--[if lt IE 7]>      <html class="no-js lt-ie9 lt-ie8 lt-ie7"> <![endif]-->
<!--[if IE 7]>         <html class="no-js lt-ie9 lt-ie8"> <![endif]-->
<!--[if IE 8]>         <html class="no-js lt-ie9"> <![endif]-->
<!--[if gt IE 8]><!--> <html class="no-js" ng-app="mineos"> <!--<![endif]-->
<head>
    <!-- START META SECTION -->
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <title translate="WEBSITE_TITLE"></title>
    <meta name="description" content="">
    <meta name="viewport" content="width=device-width, user-scalable=0, initial-scale=1.0">
    <!--/ END META SECTION -->

    <!-- START STYLESHEET SECTION -->
    <!-- IMPORTANT! :  All the available plugin will be loaded at once -->
    <!-- Stylesheet(Bootstrap) -->
    <link rel="stylesheet" href="assets/bootstrap/css/bootstrap.min.css">
    <link rel="stylesheet" href="assets/bootstrap/css/bootstrap-responsive.min.css">
    <!--/ Stylesheet(Bootstrap) -->

    <!-- Stylesheet(Application) -->
    <link rel="stylesheet" href="css/style.css">
    <link rel="stylesheet" href="css/custom.css">
    <link rel="stylesheet" id="base-color" href="css/color/serene.css"><!-- Base Theme Color -->
    <link rel="stylesheet" id="base-bg" href="css/background/bg1.css"><!-- Boxed Background -->
    <!--/ Stylesheet(Application) -->

    <!-- Stylesheet(Plugins) -->
    <link rel="stylesheet" href="assets/jui/css/jquery-ui-1.10.3.min.css">
    <link rel="stylesheet" href="assets/select2/css/select2.min.css">
    <link rel="stylesheet" href="assets/formvalidation/validationengine/css/jquery.validationEngine.min.css">
    <link rel="stylesheet" href="assets/fullcalendar/css/fullcalendar.min.css">
    <link rel="stylesheet" href="assets/datatable/css/dataTables-bootstrap.min.css">
    <link rel="stylesheet" href="assets/gritter/css/jquery.gritter.min.css">
    <!--/ Stylesheet(Plugins) -->
    <!--/ END STYLESHEET SECTION -->

    <!-- START JAVASCRIPT SECTION - Load only modernizr script here -->
    <!-- Javascript(Modernizr) -->
    <script src="assets/modernizr/js/modernizr-2.6.2.min.js"></script>
    <!--/ Javascript(Modernizr) -->
    <!--/ END JAVASCRIPT SECTION -->
</head>
<body ng-controller="Webui">
    <!-- START Template Wrapper -->
    <!-- If you want to enable the fixed sidebar or fixed header, just add `.fixed-sidebar` or `.fixed-header` class to the `#wrapper` div below -->
    <!-- IMPORTANT! : fixed sidebar will automatically add `.fixed-header` class to the `#wrapper` div -->
    <!-- If you want to enable the boxed layout, just add `.boxed-layout` class to the `#wrapper` div below -->
    <div id="wrapper" class="boxed-layout">
        <!-- START Template Canvas -->
        <div id="canvas">

            <!-- START Template Header -->
            <header id="header">
                <!-- START Logo -->
                <div class="logo hidden-phone hidden-tablet">
                    <a href="#"><img src="img/logo-white.png" alt=""></a>
                </div>
                <!--/ END Logo -->

                <!-- START Mobile Sidebar Toggler -->
                <a href="#" class="toggler" data-toggle="sidebar"><span class="icon icone-reorder"></span></a>
                <!--/ END Mobile Sidebar Toggler -->

                <!-- START Toolbar -->
                <ul class="toolbar" id="toolbar" ng-controller="Toolbar">
                    
                    <!-- START Notification -->
                    <li class="notification">
                        <a href="#" data-toggle="dropdown">
                            <span class="icon iconm-bell-2"></span>
                        </a>
                        <!-- START Dropdown Menu -->
                        <div class="dropdown-menu" role="menu">
                            <header translate="NOTIFICATIONS"></header>
                            <ul class="body">
                                <li ng-repeat="notice in all_notices() | orderBy:'-time_initiated' | limitTo: 10">
                                    <span class="icon icone-hdd"></span>
                                    <a href="#" class="text">
                                        <strong>[{{ notice.server_name }}] {{ notice.command }}</strong> {{ notice.success ? 'success' : 'failed' }}<br>
                                        <small am-time-ago="notice.time_resolved"></small>
                                    </a>
                                    <span class="action"><a class="close" href="#">&times;</a></span>
                                </li>
                            </ul>
                        </div>
                        <!--/ END Dropdown Menu -->
                    </li>
                    <!--/ END Notification -->

                    <!-- START Profile -->
                    <li class="profile">
                        <a href="#" data-toggle="dropdown">
                            <span class="text hidden-phone">{{ username }}</span>
                            <span class="arrow icone-caret-down"></span>
                        </a>
                        <!-- START Dropdown Menu -->
                        <div class="dropdown-menu" role="menu">
                            <footer>
                                <a href="https://github.com/hexparrot/mineos-node/commit/{{ git_commit }}">git commit: {{ git_commit }}</a><br>
                                <a ng-click="host_command('refresh_server_list')" class="text"><span class="icon icone-globe"></span> {{ 'REFRESH_SERVER_LIST' | translate }}</a><br>
                                <a ng-click="host_command('refresh_profile_list', {redownload: true})" class="text"><span class="icon icone-globe"></span> {{ 'REFRESH_PROFILE_LIST' | translate }}</a><br>
                                <a ng-click="modals.open_locales()" class="text"><span class="icon icone-globe"></span> {{ 'CHANGE_LOCALE' | translate }}</a><br>
                                <a href="/logout" class="text"><span class="icon icone-off"></span> {{ 'LOGOFF' | translate }}</a>
                            </footer>
                        </div>
                        <!--/ END Dropdown Menu -->
                    </li>
                    <!--/ END Profile -->
                </ul>
                <!--/ END Toolbar -->
            </header>
            <!--/ END Template Header -->

            <!-- START Template Sidebar -->
            <aside id="sidebar">
                <!-- START Sidebar Content -->
                <div class="sidebar-content">
                    <!-- START Tab Content -->
                    <div class="tab-content">
                        <!-- START Tab Pane(menu) -->
                        <div class="tab-pane active" id="tab-menu">
                            <!-- START Sidebar Menu -->
                            <nav id="nav" class="accordion">
                                <ul id="navigation">
                                    <!-- START Menu Divider -->
                                    <li class="divider" translate="HOST_SETTINGS"></li>
                                    <!--/ END Menu Divider -->

                                    <!-- START Menu -->
                                    <li class="accordion-group">
                                        <a ng-click="change_page('dashboard')">
                                            <span class="icon icone-dashboard"></span>
                                            <span class="text" translate="DASHBOARD"></span>
                                            <span class="label label-inverse">{{ servers_up() }}</span>
                                        </a>
                                    </li>
                                    <!--/ END Menu -->

                                    <!-- START Menu -->
                                    <li class="accordion-group">
                                        <a ng-click="change_page('create_server')">
                                            <span class="icon icone-share"></span>
                                            <span class="text" translate="CREATE_NEW_SERVER"></span>
                                        </a>
                                    </li>
                                    <!--/ END Menu -->

                                    <!-- START Menu -->
                                    <li class="accordion-group">
                                        <a ng-click="change_page('import')">
                                            <span class="icon icone-share"></span>
                                            <span class="text" translate="IMPORT_SERVER"></span>
                                        </a>
                                    </li>
                                    <!--/ END Menu -->

                                    <!-- START Menu -->
                                    <li class="accordion-group">
                                        <a ng-click="change_page('profiles')">
                                            <span class="icon icone-tags"></span>
                                            <span class="text" translate="PROFILES"></span>
                                        </a>
                                    </li>
                                    <!--/ END Menu -->

                                    <!-- START Menu -->
                                    <li class="accordion-group">
                                        <a ng-click="change_page('buildtools')">
                                            <span class="icon icone-tags"></span>
                                            <span class="text" translate="SPIGOT_CRAFTBUKKIT"></span>
                                        </a>
                                    </li>
                                    <!--/ END Menu -->

                                    <!-- START Menu -->
                                    <li class="accordion-group">
                                        <a ng-click="change_page('calendar')">
                                            <span class="icon icone-calendar"></span>
                                            <span class="text" translate="CALENDAR"></span>
                                        </a>
                                    </li>
                                    <!--/ END Menu -->

                                    <!-- START Menu Divider -->
                                    <li class="divider" translate="SERVER_SETTINGS"></li>
                                    <!--/ END Menu Divider -->

                                    <!-- START Menu -->
                                    <li class="accordion-group" ng-show="current">
                                        <a ng-click="change_page('server_status')">
                                            <span class="icon icone-globe"></span>
                                            <span class="text" translate="SERVER_STATUS"></span>
                                        </a>
                                    </li>
                                    <!--/ END Menu -->

                                    <!-- START Menu -->
                                    <li class="accordion-group" ng-show="current && !servers[current].sc.minecraft.unconventional">
                                        <a ng-click="change_page('server_properties')">
                                            <span class="icon iconm-pencil-5"></span>
                                            <span class="text">server.properties</span>
                                        </a>
                                    </li>
                                    <!--/ END Menu -->

                                    <!-- START Menu -->
                                    <li class="accordion-group" ng-show="current && servers[current].cy">
                                        <a ng-click="change_page('config_yml')">
                                            <span class="icon iconm-pencil-5"></span>
                                            <span class="text">config.yml</span>
                                        </a>
                                    </li>
                                    <!--/ END Menu -->

                                    <!-- START Menu Divider -->
                                    <li class="divider" translate="BACKUPS_AND_RESTORES" ng-show="current"></li>
                                    <!--/ END Menu Divider -->

                                    <!-- START Menu -->
                                    <li class="accordion-group" ng-show="current">
                                        <a ng-click="change_page('restore_points')">
                                            <span class="icon icone-hdd"></span>
                                            <span class="text" translate="RESTORE_POINTS"></span>
                                        </a>
                                    </li>
                                    <!--/ END Menu -->

                                    <!-- START Menu -->
                                    <li class="accordion-group" ng-show="current">
                                        <a ng-click="change_page('archives')">
                                            <span class="icon icone-hdd"></span>
                                            <span class="text" translate="ARCHIVES"></span>
                                        </a>
                                    </li>
                                    <!--/ END Menu -->

                                    <!-- START Menu -->
                                    <li class="accordion-group" ng-show="current">
                                        <a ng-click="change_page('cron')">
                                            <span class="icon icone-time"></span>
                                            <span class="text" translate="SCHEDULING"></span>
                                        </a>
                                    </li>
                                    <!--/ END Menu -->

                                    <!-- START Menu Divider -->
                                    <li class="divider" translate="LOGGING" ng-show="current"></li>
                                    <!--/ END Menu Divider -->

                                    <!-- START Menu -->
                                    <li class="accordion-group" ng-show="current && servers[current].live_logs['logs/latest.log'].length">
                                        <a ng-click="change_page('console')">
                                            <span class="icon icone-desktop"></span>
                                            <span class="text">logs/latest.log</span>
                                        </a>
                                    </li>
                                    <!--/ END Menu -->                                    

                                    <!-- START Menu -->
                                    <li class="accordion-group" ng-show="current && servers[current].live_logs['server.log'].length">
                                        <a ng-click="change_page('console2')">
                                            <span class="icon icone-desktop"></span>
                                            <span class="text">server.log</span>
                                        </a>
                                    </li>
                                    <!--/ END Menu -->

                                    <!-- START Menu -->
                                    <li class="accordion-group" ng-show="current && servers[current].live_logs['proxy.log.0'].length">
                                        <a ng-click="change_page('console3')">
                                            <span class="icon icone-desktop"></span>
                                            <span class="text">proxy.log.0</span>
                                        </a>
                                    </li>
                                    <!--/ END Menu -->

                                    <!-- START Menu -->
                                    <li class="accordion-group" ng-show="current && servers[current].heartbeat.query.player_">
                                        <a ng-click="change_page('player_interaction')">
                                            <span class="icon icone-group"></span>
                                            <span class="text" translate="PLAYER_INTERACTION"></span>
                                        </a>
                                    </li>
                                    <!--/ END Menu -->
                                </ul>
                            </nav>
                            <!--/ END Sidebar Menu -->
                        </div>
                        <!--/ END Tab Pane(menu) -->
                    </div>
                    <!--/ END Tab Content -->
                </div>
                <!--/ END Sidebar Content -->
            </aside>
            <!--/ END Template Sidebar -->

            <!-- START Template Main Content -->
            <section id="main">
                <!-- START Bootstrap Navbar -->
                <div class="navbar navbar-static-top">
                    <div class="navbar-inner">
                        <!-- Breadcrumb -->
                        <ul class="breadcrumb">
                            <li><a href="#" translate="CURRENTLY_SELECTED_SERVER"></a> <span class="divider"></span></li>
                            <li class="active">
                                <!-- Select -->
                                    <div class="control-group">
                                        <div class="controls">
                                            <select class="span2" ng-model="current" ng-options="name as name for (name, instance) in servers | membership">
                                            </select>
                                        </div>
                                    </div>
                                <!--/ Select -->
                            </li>
                        </ul>
                        <!--/ Breadcrumb -->
                    </div>
                </div>
                <!--/ END Bootstrap Navbar -->

                <!-- START Content - BLANK CONTAINER TEMPLATE -->
                <div class="container-fluid" ng-show="page == 'blank'">


                </div>
                <!--/ END Content -->

                <!-- START Content -->
                <div class="container-fluid" ng-show="page == 'dashboard'">
                    <!-- START Row -->
                    <div class="row-fluid">
                        <!-- START Page/Section header -->
                        <div class="span12">
                            <div class="page-header line1">
                                <h4 translate="SERVER_OVERVIEW"></h4>
                            </div>
                        </div>
                        <!--/ END Page/Section header -->
                    </div>
                    <!--/ END Row -->

                    <!-- START Row -->
                    <div class="row-fluid">
                        <!-- START Circular Summary -->
                        <div class="span12 widget borderless">
                            <section class="body">
                                <div class="body-inner no-padding" style="">
                                    <!-- START Summary -->
                                    <figure class="stats summary stacked">
                                        <div class="icon circle green"><span class="icone-ok"></span></div>
                                        <figcaption>
                                            <h3>{{ servers_up() }}<small translate="SERVERS_RUNNING"></small></h3>
                                        </figcaption>
                                    </figure><!--/ END Summary -->

                                    <!-- START Circular -->
                                    <figure class="stats summary stacked circular">
                                        <div class="gauge gauge-red" data-percent="{{ players_online()/player_capacity()*100 }}">
                                            <span class="icon icone-exchange"></span>
                                        </div>
                                        <figcaption>
                                            <h4>{{ players_online() }}<small translate="PLAYERS_ONLINE"></small></h4>
                                        </figcaption>
                                    </figure><!--/ END Circular -->

                                    <!-- START Summary -->
                                    <figure class="stats summary stacked" ng-show="host_heartbeat.uptime">
                                        <div class="icon circle lime"><span class="icone-time"></span></div>
                                        <figcaption>
                                            <h3>{{ host_heartbeat.uptime | seconds_to_time }}<small translate="UPTIME"></small></h3>
                                        </figcaption>
                                    </figure><!--/ END Summary -->

                                    <!-- START Circular -->
                                    <figure class="stats summary stacked circular" ng-show="host_heartbeat.freemem">
                                        <div class="gauge gauge-teal" data-percent="20">
                                            <span class="icon icone-ticket"></span>
                                        </div>
                                        <figcaption>
                                            <h4>{{ host_heartbeat.freemem | bytes_to_mb }}<small translate="RAM_FREE"></small></h4>
                                        </figcaption>
                                    </figure><!--/ END Circular -->
                                </div>
                            </section>
                        </div>
                        <!--/ END Circular Summary -->
                    </div>
                    <!--/ END Row -->

                    <!-- START Row -->
                    <div class="row-fluid">
                        <!-- START Line Chart - Filled -->
                        <div class="span12 widget stacked">
                            <header>
                                <h4 class="title" translate="LOAD_AVERAGES"></h4>
                            </header>
                            <section class="body">
                                <div class="body-inner">

                                        <!-- START Auto Update Chart -->
                                        <div class="span12 widget">
                                            <section class="body">
                                                <div class="body-inner">
                                                    <div class="flot" id="load_averages"></div>
                                                </div>
                                            </section>
                                        </div>
                                        <!--/ END Auto Update Chart -->

                                </div>
                            </section>
                        </div>
                        <!--/ END Line Chart - Filled -->
                    </div>
                    <!--/ END Row -->

                    <!-- START Row -->
                    <div class="row-fluid">
                        <!-- START Basic Table -->
                        <div class="span12 widget">
                            <section class="body">
                                <div class="body-inner no-padding">
                                    <table class="table">
                                        <thead>
                                            <tr>
                                                <th translate="SERVER"></th>
                                                <th translate="PROFILE"></th>
                                                <th class="hidden-phone" translate="PORT"></th>
                                                <th translate="STATUS"></th>
                                                <th translate="MEMORY"></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr ng-repeat="(server_name, instance) in servers" ng-show="!!instance.sp">
                                                <td>
                                                    <img ng-show="instance.icon.length" style="width:32px;height:32px;" ng-attr-src="{{ 'data:image/png;base64, ' + instance.icon }}" />
                                                    <a ng-click="$parent.change_page('server_status', server_name)">{{ server_name }}</a>
                                                </td>
                                                <td><a ng-attr-title="{{ 'MC Protocol: ' + instance.heartbeat.ping.protocol }}">{{ instance.sc.minecraft.profile }}</a></td>
                                                <td class="hidden-phone">{{ (instance.sc.minecraft.unconventional ? '-----' : instance.sp['server-port']) }}</td>
                                                <td><span class="label" ng-show="instance.heartbeat" ng-class="{'label-success': instance.heartbeat.up, 'label-important': !instance.heartbeat.up}">{{ instance.heartbeat.up ? 'up' : 'down' }}</span></td>
                                                <td>{{ instance.heartbeat.memory.VmRSS | kb_string_to_mb }}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </section>
                        </div>
                        <!--/ END Basic Table -->
                    </div>
                    <!--/ END Row -->
                </div>
                <!--/ END Content -->

                <!-- START Content - CREATE_NEW_SERVER -->
                <div class="container-fluid" ng-show="page == 'create_server'">

                    <!-- START General Elements -->
                        
                    <header>
                        <h4 class="title"> {{ 'CREATE_NEW_SERVER' | translate }}</h4>
                    </header>
                    <section class="body">
                        <form class="widget stacked dark form-horizontal bordered">
                            <div class="body-inner">
                                <!-- Help Text -->
                                <div class="control-group">
                                    <label class="control-label" translate="SERVER_NAME"></label>
                                    <div class="controls">
                                        <div class="row-fluid">
                                            <div class="span4">
                                                <input type="text" ng-model="serverform.server_name"><span class="help-block" translate="CREATE_HELP"></span>
                                            </div>
                                        </div>
                                    </div>
                                </div><!--/ Help Text -->

                                <!-- Default Checkbox -->
                                    <div class="control-group">
                                    <label class="control-label"></label>
                                    <div class="controls">
                                        <label class="checkbox">
                                            <input type="checkbox" class="nostyle" value="true" ng-model="unconventional"> {{ 'UNCONVENTIONAL_SERVER_TYPE' | translate}}
                                        </label>
                                    </div>
                                </div><!--/ Default Checkbox -->

                                <!-- Input Text Placeholder -->
                                <div class="control-group" ng-hide="unconventional">
                                    <label class="control-label">server-port</label>
                                    <div class="controls">
                                        <input type="text" placeholder="25565" class="span2" ng-model="serverform.server_port">
                                    </div>
                                </div><!--/ Input Text Placeholder -->

                                <!-- Input Text Placeholder -->
                                <div class="control-group" ng-hide="unconventional">
                                    <label class="control-label">server-ip</label>
                                    <div class="controls">
                                        <input type="text" placeholder="0.0.0.0" class="span2" ng-model="serverform.server_ip">
                                    </div>
                                </div><!--/ Input Text Placeholder -->

                                <!-- Input Text Placeholder -->
                                <div class="control-group" ng-hide="unconventional">
                                    <label class="control-label">max-players</label>
                                    <div class="controls">
                                        <input type="text" placeholder="20" class="span2" ng-model="serverform.max_players">
                                    </div>
                                </div><!--/ Input Text Placeholder -->

                                <!-- Input Text Placeholder -->
                                <div class="control-group" ng-hide="unconventional">
                                    <label class="control-label">level-name</label>
                                    <div class="controls">
                                        <input type="text" placeholder="world" class="span2" ng-model="serverform.level_name">
                                    </div>
                                </div><!--/ Input Text Placeholder -->

                                <!-- Input Text Placeholder -->
                                <div class="control-group" ng-hide="unconventional">
                                    <label class="control-label">level-seed</label>
                                    <div class="controls">
                                        <input type="text" placeholder="" class="span2" ng-model="serverform.level_seed">
                                    </div>
                                </div><!--/ Input Text Placeholder -->

                                <!-- Select -->
                                <div class="control-group" ng-hide="unconventional">
                                    <label class="control-label">difficulty</label>
                                    <div class="controls">
                                        <select class="span2" ng-model="serverform.difficulty">
                                            <option value="0" selected>Peaceful</option>
                                            <option value="1">Easy</option>
                                            <option value="2">Normal</option>
                                            <option value="3">Hard</option>
                                        </select>
                                    </div>
                                </div><!--/ Select -->

                                <!-- Select -->
                                <div class="control-group" ng-hide="unconventional">
                                    <label class="control-label">gamemode</label>
                                    <div class="controls">
                                        <select class="span2" ng-model="serverform.gamemode">
                                            <option value="0" selected>Survival</option>
                                            <option value="1">Creative</option>
                                            <option value="2">Adventure</option>
                                        </select>
                                    </div>
                                </div><!--/ Select -->

                                <!-- Select -->
                                <div class="control-group" ng-hide="unconventional">
                                    <label class="control-label">level-type</label>
                                    <div class="controls">
                                        <input type="text" placeholder="DEFAULT" class="span2" ng-model="serverform.level_type">
                                    </div>
                                </div><!--/ Select -->

                                <!-- Default Checkbox -->
                                    <div class="control-group" ng-hide="unconventional">
                                    <label class="control-label">generate-structures</label>
                                    <div class="controls">
                                        <label class="checkbox">
                                            <input type="checkbox" class="nostyle" value="true" ng-model="serverform.generate_structures"> 
                                        </label>
                                    </div>
                                </div><!--/ Default Checkbox -->

                                <!-- START Button Sizing -->
                                <div class="control-group">
                                    <p>
                                        <button type="submit" class="btn btn-primary" ng-click="create_server()" translate="CREATE_NEW_SERVER"></button>
                                    </p>
                                </div>
                                <!--/ END Button Default -->

                            </div>
                        </form>
                    </section>
                
                <!--/ END General Elements -->
                </div>
                <!--/ END Content -->


                <!-- START Content - IMPORTS -->
                <div class="container-fluid" ng-show="page == 'import'">
                    <!-- START Row -->
                    <div class="row-fluid">
                        <!-- START Basic Table -->
                        <div class="span12 widget">
                            <header>
                                <h4 class="title" translate="AVAILABLE_ARCHIVES"></h4>
                            </header>
                            <section class="body">
                                <div class="body-inner no-padding">
                                    <table class="table">
                                        <thead>
                                            <tr>
                                                <th translate="TIMESTAMP"></th>
                                                <th translate="SIZE"></th>
                                                <th translate="FILENAME"></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr ng-repeat="archive in archive_list">
                                                <td>{{ archive.time | amDateFormat: "dddd, MMMM Do YYYY, h:mm:ss a"  }}</td>
                                                <td>{{ archive.size | bytes_to_mb }}</td>
                                                <td>{{ archive.filename }}</td>
                                                <td>
                                                    <p>
                                                        <div class="btn-group">
                                                            <button class="btn btn-small btn-primary" ng-click="server_from_archive(archive.filename, null)">{{ 'CREATE_FROM_ARCHIVE' | translate }} </button>
                                                        </div>
                                                    </p>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </section>
                        </div>
                        <!--/ END Basic Table -->
                    </div>
                    <!--/ END Row -->
                </div>
                <!--/ END Content -->


                <!-- START Content - profiles -->
                <div class="container-fluid" ng-show="page == 'profiles'">
                    <!-- START Row -->
                    <div class="row-fluid">
                        <!-- START Basic Table -->
                        <div class="span12 widget">
                            <header>
                                <h4 class="title" translate="AVAILABLE_SERVER_JARS"></h4> 
                            </header>
                            <section class="body">
                                <div class="body-inner no-padding">
                                    <table class="table">
                                        <thead>
                                            <tr>
                                                <th translate="IDENTIFIER"></th>
                                                <th translate="PROFILE_DESC"></th>
                                                <th translate="RELEASE_TYPE"></th>
                                                <th></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>
                                                    <select ng-model="serverprofiles.group" class="span12">
                                                        <option selected value="mojang">Mojang</option>
                                                        <option value="ftb">Feed the Beast</option>
                                                        <option value="ftb_third_party">FTB-3rd Party</option>
                                                        <option value="forge">Forge</option>
                                                        <option value="pocketmine">Pocketmine</option>
                                                        <option value="php">Pocketmine-php</option>
                                                        <option value="bungeecord">BungeeCord</option>
                                                        <option value="all">Show All</option>
                                                    </select>
                                                </td>
                                                <td></td>
                                                <td>
                                                    <select ng-model="serverprofiles.type" class="span12">
                                                        <option selected value="release">Release</option>
                                                        <option value="snapshot">Snapshot</option>
                                                        <option value="old_version">Old Versions</option>
                                                        <option value="all">Show All</option>
                                                    </select>
                                                </td>
                                                <td>
                                                    <select ng-model="serverprofiles.downloaded">
                                                        <option value="all" selected>Show All</option>
                                                        <option value="only_downloaded">Only Downloaded</option>
                                                    </select>
                                                </td>
                                            </tr>
                                        </tbody>
                                        <tbody>
                                            <tr ng-repeat="jar in profiles | 
                                                           profile_filter: {field: 'group', value: serverprofiles.group} | 
                                                           profile_filter: {field: 'type', value: serverprofiles.type} | 
                                                           profile_downloaded: serverprofiles.downloaded | 
                                                           orderBy:['+weight', '-releaseTime', 'id']">
                                                <td>{{ jar.id }}</td>
                                                <td>{{ jar.webui_desc }}</td>
                                                <td>[{{ jar.group }}] <strong>{{ jar.type }}</strong></td>
                                                <td>
                                                    <p>
                                                        <button type="button" class="btn btn-mini btn-success" ng-click="host_command('download', {profile: jar})" translate="DOWNLOAD"></button> <span ng-show="jar.progress.percent > 0 && jar.progress.percent < 100">{{ jar.progress.percent + '%' }}</span> <span ng-show="jar.downloaded" class="icone-ok">{{ 'DOWNLOADED' | translate }}</span>
                                                    </p>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </section>
                        </div>
                        <!--/ END Basic Table -->
                    </div>
                    <!--/ END Row -->


                </div>
                <!--/ END Content -->

                <!-- START Content - profiles -->
                <div class="container-fluid" ng-show="page == 'buildtools'">
                    <!-- START Row -->
                    <div class="row-fluid">
                        <!-- START Basic Table -->
                        <div class="span12 widget">
                            <header>
                                <h4 class="title" translate="BUILDTOOLS"></h4> 
                            </header>
                            <section class="body">
                                <div class="body-inner no-padding">
                                    <p translate="BUILDTOOLS_INSTRUCTIONS"></p>
                                    <button type="button" class="btn btn-mini btn-success" ng-click="host_command('download', {profile: buildtools_jar})" translate="DOWNLOAD_BUILDTOOLS"></button>
                                    <table class="table">
                                        <thead>
                                            <tr>
                                                <th translate="IDENTIFIER" class="span4"></th>
                                                <th translate="ACTIONS"></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr ng-repeat="jar in profiles | 
                                                           profile_filter: {field: 'group', value: 'mojang'} | 
                                                           profile_filter: {field: 'type', value: 'release'} | 
                                                           remove_old_versions: 1.8 | 
                                                           orderBy:['+weight', '-releaseTime', 'id']">
                                                <td>{{ jar.id }}</td>
                                                <td>
                                                    <button type="button" class="btn btn-mini btn-success" ng-click="host_command('build_jar', {builder: buildtools_jar, version: jar.id})" ng-disabled="!buildtools_jar.downloaded" translate="BUILD_JAR"></button>
                                                    <button type="button" class="btn btn-mini btn-primary" ng-click="modals.open_copy_to_server(jar.id)" ng-show="spigot_list[jar.id].jarfiles.length" translate="COPY_TO_SERVER"></button>
                                                    <button type="button" class="btn btn-mini btn-danger" ng-click="host_command('delete_build', {version: jar.id})" ng-show="spigot_list[jar.id].jarfiles.length" translate="DELETE"></button>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </section>
                        </div>
                        <!--/ END Basic Table -->
                    </div>
                    <!--/ END Row -->
                    <!-- START Row -->
                    <div class="row-fluid">
                        <!-- START Basic Table -->
                        <div class="span12 widget dark stacked">
                            <header>
                                <h4 class="title" translate="OUTPUT_FROM_BUILDTOOLS"></h4>
                            </header>
                            <section class="body">
                                <div class="body-inner no-padding">
                                    <table class="table">
                                        <tbody>
                                            <tr ng-repeat="line in build_jar_log track by $index">
                                                <td>{{ line }}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </section>
                        </div>
                        <!--/ END Basic Table -->
                    </div>
                    <!--/ END Row -->

                </div>
                <!--/ END Content -->

                <!-- START Content - SERVER_STATUS -->
                <div class="container-fluid" ng-show="page == 'server_status'">
                    <!-- START Row -->
                    <div class="row-fluid">
                        <!-- START Default Widget -->
                        <div class="widget borderless">
                            <header>
                                <h4 class="title"><span class="icon icone-globe"></span> {{ 'GLANCE' | translate }}</h4>
                            </header>
                            <section class="body">
                                <div class="body-inner">
                                    <!-- START Row -->
                                    <div class="row-fluid">
                                        <!-- START Circular Summary -->
                                        <div class="span12 widget borderless">
                                            <section class="body">
                                                <div class="body-inner no-padding" style="">
                                                    <!-- START Summary -->
                                                    <figure class="stats summary stacked">
                                                        <div class="icon circle" ng-class="{green: servers[current].heartbeat.up, red: servers[current].heartbeat.up == false}"><span class="icone-ok"></span></div>
                                                        <figcaption>
                                                            <h4>{{ servers[current].heartbeat.up ? 'UP' : 'DOWN' }}<small translate="SERVER_STATUS"></small></h4>
                                                        </figcaption>
                                                    </figure><!--/ END Summary -->

                                                    <!-- START Circular -->
                                                    <figure class="stats summary stacked circular" ng-hide="servers[current].sc.minecraft.unconventional">
                                                        <div id="capacity_gauge" class="gauge gauge-red" data-percent="0">
                                                            <span class="icon icone-exchange"></span>
                                                        </div>
                                                        <figcaption>
                                                            <h4>{{ servers[current].heartbeat.ping.players_online ? servers[current].heartbeat.ping.players_online : 0 }} / {{ servers[current].sp['max-players'] }}<small translate="PLAYERS_ONLINE"></small></h4>
                                                        </figcaption>
                                                    </figure><!--/ END Circular -->

                                                    <!-- START Summary -->
                                                    <figure class="stats summary stacked">
                                                        <div class="icon circle blue"><span class="icone-cogs"></span></div>
                                                        <figcaption>
                                                            <h4>{{ servers[current].sc.minecraft.profile }}&nbsp;<small translate="PROFILE"></small></h4>
                                                        </figcaption>
                                                    </figure><!--/ END Summary -->

                                                    <!-- START Summary -->
                                                    <figure class="stats summary stacked" ng-hide="servers[current].sc.minecraft.unconventional">
                                                        <div class="icon circle blue"><span class="icone-cogs"></span></div>
                                                        <figcaption>
                                                            <h4>{{ servers[current].heartbeat.ping.server_version }}&nbsp;<small translate="REPORTED_VERSION"></small></h4>
                                                        </figcaption>
                                                    </figure><!--/ END Summary -->

                                                    <!-- START Circular -->
                                                    <figure class="stats summary stacked circular">
                                                        <div id="memory_gauge" class="gauge gauge-teal" data-percent="0">
                                                            <span class="icon icone-ticket"></span>
                                                        </div>
                                                        <figcaption>
                                                            <h4>{{ servers[current].heartbeat.memory.VmRSS | kb_string_to_mb }}&nbsp;<small translate="MEMORY_FOOTPRINT"></small></h4>
                                                        </figcaption>
                                                    </figure><!--/ END Circular -->
                                                </div>
                                            </section>
                                        </div>
                                        <!--/ END Circular Summary -->
                                    </div>
                                    <!--/ END Row -->

                                    <!-- START Row -->
                                    <div class="row-fluid">
                                        <!-- START Button Default -->
                                        <div class="span6 widget">
                                            <header><h4 class="title"><span class="icon icone-home"></span>{{ 'SERVER_ACTIONS' | translate }}</h4></header>
                                            <section class="body">
                                                <div class="body-inner">

                                                    <div class="span4">
                                                        <button type="button" class="btn btn-success span12" ng-disabled="servers[current].heartbeat.up" ng-click="server_command('start')" translate="START" ng-show="(servers[current].sc.java.jarfile && servers[current].sc.java.java_xmx)"></button>
                                                        <button type="button" class="btn btn-success span12" ng-disabled="servers[current].heartbeat.up" ng-click="modals.open_new_server()" translate="START" ng-show="!(servers[current].sc.java.jarfile && servers[current].sc.java.java_xmx)"></button>
                                                    </div>

                                                    <div class="span4">
                                                        <div class="btn-group btn-block">
                                                            <button class="btn btn-danger span6" translate="STOP"
                                                                    ng-disabled="!servers[current].heartbeat.up" 
                                                                    ng-click="server_command('stop')"
                                                                    ng-hide="servers[current].sc.minecraft.unconventional"
                                                                    ></button>
                                                            <button class="btn btn-danger span6" translate="KILL"
                                                                    ng-disabled="!servers[current].heartbeat.up" 
                                                                    ng-click="server_command('kill')" 
                                                                    ng-hide="!servers[current].sc.minecraft.unconventional"
                                                                    ></button>
                                                            <button class="btn btn-danger dropdown-toggle" data-toggle="dropdown" ng-hide="servers[current].sc.minecraft.unconventional"><span class="caret"></span></button>
                                                            <ul class="dropdown-menu" ng-hide="servers[current].sc.minecraft.unconventional">
                                                                <li><a href="#" translate="STOP"
                                                                       ng-click="server_command('stop')" 
                                                                       ng-disabled="!servers[current].heartbeat.up"></a></li>
                                                                <li><a href="#" translate="STOP_AND_BACKUP"
                                                                       ng-click="server_command('stop_and_backup')"></a></li>
                                                                <li><a href="#" translate="RESTART"
                                                                       ng-click="server_command('restart')"></a></li>
                                                                <li><a href="#" translate="KILL" 
                                                                       ng-click="server_command('kill')"
                                                                       ng-disabled="!servers[current].heartbeat.up"></a></li>
                                                            </ul>
                                                        </div>
                                                    </div>

                                                    <div class="span4">
                                                        <button type="button" class="btn pull-right" ng-click="modals.open_accept_eula()" translate="ACCEPT_EULA" ng-class="{'btn-default': servers[current].page_data.glance.eula != false, 'btn-primary': servers[current].page_data.glance.eula == false}" ng-hide="servers[current].sc.minecraft.unconventional"></button>
                                                    </div>

                                                    <div class="clearfix"></div><div class="span12"></div>

                                                    <!-- Select -->
                                                    <div class="control-group">
                                                        <div class="controls">
                                                            <select class="" 
                                                                ng-model="myprofile" 
                                                                data-ng-options="p as p.id group by p.group for p in profiles | 
                                                                profile_downloaded: 'only_downloaded' | 
                                                                orderBy:'-releaseTime'" 
                                                                ng-change="change_sc('minecraft', 'profile', myprofile.id)">
                                                                <option value="" selected translate="CHANGE_PROFILE_TO"></option>
                                                            </select>
                                                        </div>
                                                        <div class="controls">
                                                            <button class="btn btn-default" ng-click="server_command('copy_profile')" translate="COPY_PROFILE"></button>
                                                        </div>
                                                    </div><!--/ Select -->
                                                    <label class="checkbox">
                                                        <input id="broadcast" type="checkbox" ng-model="broadcast_to_lan" ng-change="change_sc('minecraft', 'broadcast', broadcast_to_lan || 'false')"> {{ 'BROADCAST_TO_LAN' | translate }}
                                                    </label>
                                                    <label class="checkbox">
                                                        <input id="onrebootstart" type="checkbox" ng-model="onrebootstart" ng-change="change_sc('onreboot', 'start', onrebootstart || 'false')"> {{ 'START_ON_BOOT' | translate }}
                                                    </label>
                                                    <label class="checkbox">
                                                        <input id="unconventional"  type="checkbox" ng-model="unconventional_server" ng-change="change_sc('minecraft', 'unconventional', unconventional_server || 'false')"> {{ 'UNCONVENTIONAL_SERVER' | translate }}
                                                    </label>

                                                </div>
                                            </section>
                                        </div>
                                        <!--/ END Button Default -->

                                        <!-- START Button Default -->
                                        <div class="span6 widget">
                                            <header><h4 class="title"><span class="icon icone-ticket"></span>{{ 'JAVA_SETTINGS' | translate }}</h4></header>
                                            <section class="body">
                                                <div class="body-inner">
                                                    <!-- Select -->
                                                    <div class="control-group">
                                                        <div class="controls">
                                                            <select class="span6" ng-model="myjarfile" data-ng-options="j for j in servers[current].page_data.glance.server_files" ng-change="change_sc('java', 'jarfile', myjarfile)">
                                                                <option value="" selected translate="CHANGE_JARFILE_TO"></option>
                                                            </select>
                                                        </div>
                                                    </div><!--/ Select -->
                                                    <!-- Help Text -->
                                                    <div class="control-group">
                                                        <label class="control-label" translate="MEMORY_ALLOCATION"></label>
                                                        <div class="controls">
                                                            <div class="input-prepend input-append">
                                                                <span class="add-on" translate="JAVA_XMX"></span>
                                                                <input type="text" 
                                                                    ng-model="servers[current].sc.java.java_xmx" 
                                                                    ng-change="change_sc('java', 'java_xmx', servers[current].sc.java.java_xmx)" 
                                                                    ng-model-options="{ updateOn: 'default blur', debounce: {'default': 1500, 'blur': 0} }">
                                                                <span class="add-on" translate="MB_ABBREVIATION"></span>
                                                            </div>
                                                        </div>
                                                        <div class="controls">
                                                            <div class="input-prepend input-append">
                                                                <span class="add-on" translate="JAVA_XMS"></span>
                                                                <input type="text" 
                                                                    ng-model="servers[current].sc.java.java_xms" 
                                                                    ng-change="change_sc('java', 'java_xms', servers[current].sc.java.java_xms)"
                                                                    ng-model-options="{ updateOn: 'default blur', debounce: {'default': 1500, 'blur': 0} }">
                                                                <span class="add-on" translate="MB_ABBREVIATION"></span>
                                                            </div>
                                                        </div>
                                                    </div><!--/ Help Text -->
                                                    <div class="controls">
                                                        <label class="control-label" translate="ADDITIONAL_JAVA_ARGS"></label>
                                                        <input type="text" 
                                                            class="span6"
                                                            placeholder="-XX:+DisableExplicitGC"
                                                            ng-model="servers[current].sc.java.java_tweaks" 
                                                            ng-change="change_sc('java', 'java_tweaks', servers[current].sc.java.java_tweaks)" 
                                                            ng-model-options="{ updateOn: 'default blur', debounce: {'default': 1500, 'blur': 0} }">
                                                    </div>
                                                    <div class="controls">
                                                        <label class="control-label" translate="ADDITIONAL_JAR_ARGS"></label>
                                                        <input type="text" 
                                                            class="span6"
                                                            placeholder="nogui"
                                                            ng-model="servers[current].sc.java.jar_args" 
                                                            ng-change="change_sc('java', 'jar_args', servers[current].sc.java.jar_args)" 
                                                            ng-model-options="{ updateOn: 'default blur', debounce: {'default': 1500, 'blur': 0} }">
                                                    </div>
                                                </div>
                                            </section>
                                        </div>
                                        <!--/ END Button Default -->
                                    </div>
                                    <!--/ END Row -->

                                    <!-- START Row -->
                                    <div class="row-fluid">
                                        <p>&nbsp;</p>
                                    </div>
                                    <!--/ END Row -->
                                        
                                    <!-- START Row -->
                                    <div class="row-fluid">
                                        <!-- START Widget Header Badge -->
                                        <div class="span6 widget">
                                            <header>
                                                <h4 class="title"><span class="icon icone-hdd"></span> {{ 'RESTORE_POINTS' | translate }}</h4>
                                                <span class="badge badge-success pull-right" ng-click="change_page('restore_points')">{{ servers[current].page_data.glance.increments.length }}</span>
                                            </header>
                                            <section class="body">
                                                <div class="body-inner">
                                                    <p>{{ 'MOST_RECENT_RESTORE_POINT' | translate }}: <a rel="tooltip" title="{{ servers[current].page_data.glance.increments[0].time | amDateFormat:'dddd, MMMM Do YYYY, h:mm:ss a' }}" am-time-ago="servers[current].page_data.glance.increments[0].time"></a></p>
                                                    <p>{{ 'OLDEST_RESTORE_POINT' | translate }}: <a href="#" rel="tooltip" title="{{ servers[current].page_data.glance.increments.slice(-1)[0].time | amDateFormat:'dddd, MMMM Do YYYY, h:mm:ss a' }}" am-time-ago="servers[current].page_data.glance.increments.slice(-1)[0].time"></a></p>
                                                    <p>{{ 'SPACE_USED_RESTORES' | translate }}: {{ servers[current].page_data.glance.du_bwd | bytes_to_mb }}</p>
                                                    <!-- Alert Error -->
                                                    <div class="alert alert-success" ng-show="servers[current].latest_notice['backup'].success">
                                                        <button type="button" class="close" data-dismiss="alert">×</button>
                                                        <strong>{{ 'SUCCESS' | translate }}! </strong> {{ 'RESTORE_POINT_CREATED' | translate }} <span am-time-ago="servers[current].latest_notice['backup'].time_resolved"></span>.
                                                    </div><!--/ Alert Error -->
                                                    <!-- Alert Error -->
                                                    <div class="alert alert-error" ng-show="servers[current].latest_notice['backup'].success == false">
                                                        <button type="button" class="close" data-dismiss="alert">×</button>
                                                        <strong>{{ 'FAILURE' | translate }}! </strong> {{ 'RESTORE_POINT_FAILED' | translate }} <span am-time-ago="servers[current].latest_notice['backup'].time_resolved"></span>.
                                                    </div><!--/ Alert Error -->
                                                    <p><button type="button" class="btn btn-small btn-primary" ng-click="server_command('backup')"><span class="icone-plus"></span> {{ 'CREATE_NEW_RESTORE_POINT' | translate }}</button></p>
                                                </div>
                                            </section>
                                        </div>
                                        <!--/ END Widget Header Badge -->

                                        <!-- START Widget Header Badge -->
                                        <div class="span6 widget">
                                            <header>
                                                <h4 class="title"><span class="icon icone-hdd"></span> {{ 'ARCHIVES' | translate }}</h4>
                                                <span class="badge badge-success pull-right" ng-click="change_page('archives')">{{ servers[current].page_data.glance.archives.length }}</span>
                                            </header>
                                            <section class="body">
                                                <div class="body-inner">
                                                    <p>{{ 'MOST_RECENT_ARCHIVE' | translate }}: <a title="{{ servers[current].page_data.glance.archives.slice(-1)[0].time | amDateFormat:'dddd, MMMM Do YYYY, h:mm:ss a' }}" rel="tooltip" am-time-ago="servers[current].page_data.glance.archives.slice(-1)[0].time"></a></p>
                                                    <p>{{ 'OLDEST_ARCHIVE' | translate }}: <a title="{{ servers[current].page_data.glance.archives[0].time | amDateFormat:'dddd, MMMM Do YYYY, h:mm:ss a' }}" rel="tooltip" am-time-ago="servers[current].page_data.glance.archives[0].time"></a></p>
                                                    <p>{{ 'SPACE_USED_ARCHIVES' | translate }}: {{ servers[current].page_data.glance.du_awd | bytes_to_mb }}</p>
                                                    <!-- Alert Error -->
                                                    <div class="alert alert-success" ng-show="servers[current].latest_notice['archive'].success">
                                                        <button type="button" class="close" data-dismiss="alert">×</button>
                                                        <strong>{{ 'SUCCESS' | translate }}! </strong> {{ 'ARCHIVE_CREATED' | translate }} <span am-time-ago="servers[current].latest_notice['archive'].time_resolved"></span>.
                                                    </div><!--/ Alert Error -->
                                                    <!-- Alert Error -->
                                                    <div class="alert alert-error" ng-show="servers[current].latest_notice['archive'].success == false">
                                                        <button type="button" class="close" data-dismiss="alert">×</button>
                                                        <strong>{{ 'FAILURE' | translate }}! </strong> {{ 'ARCHIVE_FAILED' | translate }} <span am-time-ago="servers[current].latest_notice['archive'].time_resolved"></span>.
                                                    </div><!--/ Alert Error -->
                                                    <p><button type="button" class="btn btn-small btn-primary" ng-click="server_command('archive')"><span class="icone-plus"></span> {{ 'CREATE_NEW_ARCHIVE' | translate }}</button></p>
                                                </div>
                                                
                                            </section>
                                        </div>
                                        <!--/ END Widget Header Badge -->
                                    </div>
                                    <!--/ END Row -->

                                    <!-- START Row -->
                                    <div class="row-fluid">
                                        <p>&nbsp;</p>
                                    </div>
                                    <!--/ END Row -->

                                    <!-- START Row -->
                                    <div class="row-fluid">
                                        <!-- START Widget Header Badge -->
                                        <div class="span6 widget">
                                            <header>
                                                <h4 class="title"><span class="icon icone-bookmark"></span> {{ 'OWNERSHIP_AND_DISK_USAGE' | translate }}</h4>
                                            </header>
                                            <section class="body">
                                                <div class="body-inner">
                                                    <!-- Select -->
                                                        <div class="control-group">
                                                            <div class="controls">
                                                                {{ 'SERVER_OWNER' | translate }}: {{ '{0} ({1})'.format(
                                                                    servers[current].page_data.glance.owner.username, 
                                                                    servers[current].page_data.glance.owner.uid) }}
                                                                </select>
                                                            </div>
                                                        </div>
                                                    <!--/ Select -->
                                                    <!-- Select -->
                                                        <div class="control-group">
                                                            <div class="controls">
                                                                {{ 'GROUP_OWNER' | translate }}: <select class="span4" 
                                                                                                ng-model="servers[current].page_data.glance.owner.gid" 
                                                                                                ng-change="change_owner()">
                                                                    <option 
                                                                        ng-repeat="group in groups" 
                                                                        value="{{ group.gid }}"
                                                                        ng-selected="group.gid == servers[current].page_data.glance.owner.gid">{{ '{0} ({1})'.format(group.groupname, group.gid) }}</option>
                                                                </select>
                                                            </div>
                                                        </div>
                                                    <!--/ Select -->
                                                    <p>{{ 'SPACE_USED_LIVE' | translate }}: {{ servers[current].page_data.glance.du_cwd | bytes_to_mb }}</p>
                                                </div>
                                            </section>
                                        </div>
                                        <!--/ END Widget Header Badge -->

                                        <!-- START Widget Header Badge -->
                                        <div class="span6 widget">
                                            <header>
                                                <h4 class="title"><span class="icon icone-trash"></span> {{ 'DELETE_SERVER' | translate }}</h4>
                                            </header>
                                            <section class="body">
                                                <div class="body-inner">
                                                    <!-- Default Checkbox Inline -->
                                                    <div class="control-group">
                                                        <div class="controls">
                                                            <label class="checkbox">
                                                                <input type="checkbox" ng-model="delete_archive"> {{ 'DELETE_ARCHIVES' | translate }} {{ '{0}/{1}/{2}'.format(servers[current].page_data.glance.base_dir, 'archive', current) }}
                                                            </label>
                                                            <label class="checkbox">
                                                                <input type="checkbox" ng-model="delete_backup"> {{ 'DELETE_RESTORE_POINTS' | translate }} {{ '{0}/{1}/{2}'.format(servers[current].page_data.glance.base_dir, 'backup', current) }}
                                                            </label>
                                                            <label class="checkbox">
                                                                <input type="checkbox" ng-model="delete_servers"> {{ 'DELETE_LIVE_FILES' | translate }} {{ '{0}/{1}/{2}'.format(servers[current].page_data.glance.base_dir, 'servers', current) }}
                                                            </label>
                                                        </div>
                                                        <button type="button" class="btn btn-mini btn-danger" ng-disabled="!(delete_servers && delete_backup && delete_archive && !servers[current].heartbeat.up)" ng-click="server_command('delete')"><span class="icone-warning-sign"></span> {{ 'DELETE' | translate }}</button>
                                                    </div><!--/ Default Checkbox Inline -->

                                                </div>
                                                
                                            </section>
                                        </div>
                                        <!--/ END Widget Header Badge -->
                                    </div>
                                    <!--/ END Row -->

                                </div>
                            </section>
                        </div>
                        <!--/ END Default Widget -->
                    </div>
                    <!--/ END Row -->

                </div>
                <!--/ END Content -->

                <!-- START Content - RESTORE_POINTS -->
                <div class="container-fluid" ng-show="page == 'restore_points'">


                    <!-- START Row -->
                    <div class="row-fluid">
                        <!-- START Basic Table -->
                        <div class="span12 widget">
                            <header>
                                <h4 class="title" translate="AVAILABLE_RESTORE_POINTS"></h4>
                                <!-- START Toolbar -->
                                <ul class="toolbar pull-right">
                                    <li>
                                        <a href="#" class="link" data-toggle="dropdown"><span class="icon icone-ellipsis-vertical"></span></a>
                                        <ul class="dropdown-menu pull-right">
                                            <li><a href="#" ng-click="server_command('backup')"><span class="icon icone-hdd"></span> {{ 'CREATE_NEW_RESTORE_POINT' | translate }}</a></li>
                                        </ul>
                                    </li>
                                </ul>
                                <!--/ END Toolbar -->
                            </header>
                            <section class="body">
                                <div class="body-inner no-padding">
                                    <table class="table">
                                        <thead>
                                            <tr>
                                                <th translate="STEP"></th>
                                                <th translate="TIMESTAMP"></th>
                                                <th translate="SIZE"></th>
                                                <th translate="CUMULATIVE_SIZE"></th>
                                                <th></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr ng-repeat="incr in servers[current].page_data.glance.increments">
                                                <td>{{ incr.step }}</td>
                                                <td>{{ incr.time | amDateFormat: "dddd, MMMM Do YYYY, h:mm:ss a" }}</td>
                                                <td>{{ incr.size }}</td>
                                                <td>{{ incr.cum }}</td>
                                                <td>
                                                    <p>
                                                        <button type="button" class="btn btn-mini btn-success" ng-click="server_command('restore', {step: incr.step})" translate="RESTORE"></button>
                                                        <button type="button" class="btn btn-mini btn-danger" ng-click="server_command('prune', {step: incr.step})" translate="PRUNE"></button>
                                                    </p>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </section>
                        </div>
                        <!--/ END Basic Table -->
                    </div>
                    <!--/ END Row -->


                </div>
                <!--/ END Content -->

                <!-- START Content - ARCHIVES -->
                <div class="container-fluid" ng-show="page == 'archives'">
                    <!-- START Row -->
                    <div class="row-fluid">
                        <!-- START Basic Table -->
                        <div class="span12 widget">
                            <header>
                                <h4 class="title" translate="AVAILABLE_ARCHIVES"></h4>
                                <!-- START Toolbar -->
                                <ul class="toolbar pull-right">
                                    <li>
                                        <a href="#" class="link" data-toggle="dropdown"><span class="icon icone-ellipsis-vertical"></span></a>
                                        <ul class="dropdown-menu pull-right">
                                            <li><a href="#" ng-click="server_command('archive')"><span class="icon icone-hdd"></span> {{ 'CREATE_NEW_ARCHIVE' | translate }}</a></li>
                                        </ul>
                                    </li>
                                </ul>
                                <!--/ END Toolbar -->
                            </header>
                            <section class="body">
                                <div class="body-inner no-padding">
                                    <table class="table">
                                        <thead>
                                            <tr>
                                                <th translate="TIMESTAMP"></th>
                                                <th translate="SIZE"></th>
                                                <th translate="FILENAME"></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr ng-repeat="archive in servers[current].page_data.glance.archives">
                                                <td>{{ archive.time | amDateFormat: "dddd, MMMM Do YYYY, h:mm:ss a"  }}</td>
                                                <td>{{ archive.size | bytes_to_mb }}</td>
                                                <td>{{ archive.filename }}</td>
                                                <td>
                                                    <p>
                                                        <!-- Button Dropdown -->
                                                        <div class="btn-group">
                                                            <button class="btn btn-small dropdown-toggle" data-toggle="dropdown">{{ 'ACTIONS' | translate }} <span class="caret"></span></button>
                                                            <ul class="dropdown-menu">
                                                                <li><a ng-click="server_command('delete_archive', {filename: archive.filename})" translate="DELETE_THIS_ARCHIVE"></a></li>
                                                                <li><a href="#"></a></li>
                                                                <li><a ng-click="server_from_archive(archive.filename, current)" translate="CREATE_FROM_ARCHIVE"></a></li>
                                                            </ul>
                                                        </div><!--/ Button Dropdown -->
                                                        <!-- Button Dropdown -->
                                                    </p>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </section>
                        </div>
                        <!--/ END Basic Table -->
                    </div>
                    <!--/ END Row -->
                </div>
                <!--/ END Content -->

                <!-- START Content - SCHEDULING -->
                <div class="container-fluid" ng-show="page == 'cron'">

                    <!-- START Row -->
                    <div class="row-fluid">
                        <!-- START Basic Table -->
                        <div class="span12 widget">
                            <header>
                                <h4 class="title" translate="CRONTAB_SCHEDULE"></h4>
                            </header>
                            <section class="body">
                                <div class="body-inner no-padding">
                                    <table class="table">
                                        <thead>
                                            <tr>
                                                <th class="span4">{{ "CRON_EXPRESSION" | translate }} (<a href="https://www.npmjs.com/package/cron">?</a>)</th>
                                                <th translate="COMMAND_TO_RUN" class="span4"></th>
                                                <th translate="ADDITIONAL_ARGUMENT"></th>
                                                <th translate="ACTIONS"></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>
                                                    <p>
                                                        <!-- Input Text -->
                                                        <div class="control-group">
                                                            <div class="controls">
                                                                <input type="text" name="input-text" class="span12" ng-value="" ng-model="cron.source">
                                                            </div>
                                                        </div><!--/ Input Text -->
                                                    </p>
                                                </td>
                                                <td>
                                                    <p>
                                                        <!-- Select -->
                                                        <div class="control-group">
                                                            <div class="controls">
                                                                <select class="span12" ng-model="cron.action">
                                                                    <option translate="START" value="start"></option>
                                                                    <option translate="STOP" value="stop"></option>
                                                                    <option translate="RESTART" value="restart"></option>
                                                                    <option translate="CREATE_NEW_RESTORE_POINT" value="backup"></option>
                                                                    <option translate="CREATE_NEW_ARCHIVE" value="archive"></option>
                                                                    <option translate="SEND_TO_CONSOLE" value="stuff"></option>
                                                                </select>
                                                            </div>
                                                        </div><!--/ Select -->
                                                    </p>
                                                </td>
                                                <td>
                                                    <p>
                                                        <!-- Input Text -->
                                                        <div class="control-group">
                                                            <div class="controls">
                                                                <input type="text" name="input-text" class="span12" ng-model="cron.msg" ng-show="cron.action == 'stuff'" />
                                                            </div>
                                                        </div><!--/ Input Text -->
                                                    </p>
                                                </td>
                                                <td>
                                                    <p>
                                                        <button type="button" class="btn btn-primary" ng-click="cron_command('create', {command: cron.action, source: cron.source, msg: cron.msg})" translate="SUBMIT_CRONJOB"></button>
                                                    </p>
                                                </td>
                                            </tr>
                                            <tr ng-repeat="(hash, definition) in servers[current].cc">
                                                <td>{{ definition.source }}</td>
                                                <td>{{ definition.command }}</td>
                                                <td>{{ definition.msg }}</td>
                                                <td>
                                                    <p>
                                                        <button type="button" class="btn btn-success" ng-click="cron_command('start', {hash: hash})" translate="START" ng-disabled="definition.enabled != false"></button>
                                                        <button type="button" class="btn btn-warning" ng-click="cron_command('suspend', {hash: hash})" translate="SUSPEND" ng-disabled="definition.enabled == false"></button>
                                                        <button type="button" class="btn btn-danger" ng-click="cron_command('delete', {hash: hash})" translate="DELETE" ng-disabled="definition.enabled != false"></button>
                                                    </p>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </section>
                        </div>
                        <!--/ END Basic Table -->
                    </div>
                    <!--/ END Row -->

                </div>
                <!--/ END Content -->

                <!-- START Content - CALENDAR -->
                <div class="container-fluid" ng-show="page == 'calendar'">
                    <!-- START Row -->
                    <div class="row-fluid">
                        <!-- START Default Calendar -->
                        <div class="span12">
                            <div id="calendar" style="margin-bottom:20px;"></div>
                        </div>
                        <!--/ END Default Calendar -->
                    </div>
                    <!--/ END Row -->
                </div>
                <!--/ END Content -->

                <!-- START Content - SERVER_PROPERTIES -->
                <div class="container-fluid" ng-show="page == 'server_properties'">

                    <!-- START Row -->
                    <div class="row-fluid">
                        <!-- START Default Widget -->
                        <div class="span12 widget">
                            <header>
                                <h4 class="title"><span class="icon icone-edit"></span> server.properties</h4>
                                <!-- START Toolbar -->
                                <ul class="toolbar pull-right">
                                    <li><a href="#" class="link" ng-click="modals.open_add_sp()"><span class="icon icone-plus"></span></a></li>
                                </ul>
                                <!--/ END Toolbar -->
                            </header>
                            <section class="body">
                                <div class="body-inner">
                                    <!-- Read Only -->
                                    <div class="control-group" ng-repeat="(property, new_value) in servers[current].sp track by $index">
                                        <div class="controls">
                                            <input type="text" class="input-large" ng-value="property" readonly>
                                            <input type="text" class="input-xlarge" 
                                                ng-value="new_value" 
                                                ng-change="change_sp()" 
                                                ng-model="new_value"
                                                ng-model-options="{ updateOn: 'default blur', debounce: {'default': 1500, 'blur': 0} }">
                                        </div>
                                    </div><!--/ Read Only -->
                                </div>
                            </section>
                        </div>
                        <!--/ END Default Widget -->
                    </div>
                    <!--/ END Row -->

                </div>
                <!--/ END Content -->

                <!-- START Content - CONFIG_YML -->
                <div class="container-fluid" ng-show="page == 'config_yml'">

                    <!-- START Row -->
                    <div class="row-fluid">
                        <!-- START Default Widget -->
                        <div class="span12 widget">
                            <header>
                                <h4 class="title"><span class="icon icone-edit"></span> config.yml</h4>
                            </header>
                            <section class="body">
                                <div class="body-inner">
                                    <textarea class="span10 monospace" rows="20" ng-model="servers[current].cy" readonly></textarea>
                                </div>
                            </section>
                        </div>
                        <!--/ END Default Widget -->
                    </div>
                    <!--/ END Row -->

                </div>
                <!--/ END Content -->

                <!-- START Content - CONSOLE -->
                <div class="container-fluid" ng-show="page == 'console'">

                    <!-- START Row -->
                    <div class="row-fluid">
                        <!-- START Basic Table -->
                        <div class="console span12 widget dark">
                            <header>
                                <h4 class="title">logs/latest.log</h4>
                            </header>
                            <section class="body">
                                <div class="body-inner console-inner no-padding" sticky-console>
                                    <table class="table">
                                        <tbody>
                                            <tr ng-repeat="line in servers[current].live_logs['logs/latest.log'] track by $index">
                                                <td ng-bind-html="line | colorize"></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </section>
                        </div>
                        <!--/ END Basic Table -->
                    </div>
                    <!--/ END Row -->

                    <!-- START Row -->
                    <div class="row-fluid">
                        <div class="body-inner">
                            <div class="control-group">
                                <div class="controls console-input">
                                    <label>&gt;</label><input type="text" class="span12" ng-model="user_input" ng-enter="console_input()">
                                </div>
                            </div>
                        </div>

                    </div>
                    <!--/ END Row -->

                </div>
                <!--/ END Content -->

                <!-- START Content - CONSOLE2 -->
                <div class="container-fluid" ng-show="page == 'console2'">

                    <!-- START Row -->
                    <div class="row-fluid">
                        <div class="body-inner">
                            <div class="control-group">
                                <div class="controls">
                                    <input type="text" class="span12" ng-model="user_input" ng-enter="console_input()">
                                </div>
                            </div>
                        </div>

                    </div>
                    <!--/ END Row -->

                    <!-- START Row -->
                    <div class="row-fluid">
                        <!-- START Basic Table -->
                        <div class="span12 widget dark stacked">
                            <header>
                                <h4 class="title">server.log</h4>
                            </header>
                            <section class="body">
                                <div class="body-inner no-padding">
                                    <table class="table">
                                        <tbody>
                                            <tr ng-repeat="line in servers[current].live_logs['server.log'] track by $index">
                                                <td>{{ line }}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </section>
                        </div>
                        <!--/ END Basic Table -->
                    </div>
                    <!--/ END Row -->

                    <!-- START Row -->
                    <div class="row-fluid">
                        <div class="body-inner">
                            <div class="control-group">
                                <div class="controls">
                                    <input type="text" class="span12" ng-model="user_input" ng-enter="console_input()">
                                </div>
                            </div>
                        </div>

                    </div>
                    <!--/ END Row -->

                </div>
                <!--/ END Content -->

                <!-- START Content - CONSOLE3 -->
                <div class="container-fluid" ng-show="page == 'console3'">

                    <!-- START Row -->
                    <div class="row-fluid">
                        <div class="body-inner">
                            <div class="control-group">
                                <div class="controls">
                                    <input type="text" class="span12" ng-model="user_input" ng-enter="console_input()">
                                </div>
                            </div>
                        </div>

                    </div>
                    <!--/ END Row -->

                    <!-- START Row -->
                    <div class="row-fluid">
                        <!-- START Basic Table -->
                        <div class="span12 widget dark stacked">
                            <header>
                                <h4 class="title">proxy.log.0</h4>
                            </header>
                            <section class="body">
                                <div class="body-inner no-padding">
                                    <table class="table">
                                        <tbody>
                                            <tr ng-repeat="line in servers[current].live_logs['proxy.log.0'] track by $index">
                                                <td>{{ line }}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </section>
                        </div>
                        <!--/ END Basic Table -->
                    </div>
                    <!--/ END Row -->

                    <!-- START Row -->
                    <div class="row-fluid">
                        <div class="body-inner">
                            <div class="control-group">
                                <div class="controls">
                                    <input type="text" class="span12" ng-model="user_input" ng-enter="console_input()">
                                </div>
                            </div>
                        </div>

                    </div>
                    <!--/ END Row -->

                </div>
                <!--/ END Content -->

                <!-- START Content - PLAYER_INTERACTION -->
                <div class="container-fluid" ng-show="page == 'player_interaction'">
                    <!-- START Row -->
                    <div class="row-fluid">
                        <!-- START Default Widget -->
                        <div class="span12 widget">
                            <header>
                                <h4 class="title"><span class="icon icone-user"></span> <span translate="PLAYER_INTERACTION"></span></h4>
                            </header>
                            <section class="body">
                                <div class="body-inner">

                                    <!-- Help Text -->
                                    <div class="control-group" ng-repeat="player in servers[current].heartbeat.query.player_ track by $index">
                                        <div class="controls">
                                            <input type="text" class="input-medium" ng-value="player" readonly />
                                            <select class="input-medium" ng-model="interaction.command">
                                                <option value="/tell" selected>/tell</option>
                                                <option value="/give">/give</option>
                                                <option value="/tp">/tp</option>
                                                <option value="/kick">/kick</option>
                                                <option value="/spawnpoint">/spawnpoint</option>
                                                <option value="/whitelist">/whitelist</option>

                                                <option value="/title">/title</option>
                                                <option value="/enchant">/enchant</option>
                                                <option value="/effect">/effect</option>
                                            </select>
                                            <div class="input-prepend input-append" ng-show="interaction.command">
                                                <span class="add-on">{{ interaction.command + ' ' + player }}</span>
                                                <input type="text" name="input-text" class="" ng-model="interaction.args" />
                                            </div>
                                            <button class="btn btn-success control_centering" ng-click="player_command(interaction.command, player, interaction.args)" ng-show="interaction.command"><span class="icone-share-alt"></span> </button> 
                                        </div>
                                        
                                        <button class="btn btn-small" ng-click="player_command('op', player, '')"><span class="icon-arrow-up"></span> op</button>
                                        <button class="btn btn-small" ng-click="player_command('deop', player, '')"><span class="icon-arrow-down"></span> de-op</button>
                                        <button class="btn btn-small btn-warning" ng-click="player_command('kill', player, '')">Kill</button>
                                        <button class="btn btn-small btn-danger" ng-click="player_command('kick', player, '')">Kick</button>
                                        <button class="btn btn-small btn-danger" ng-click="player_command('ban', player, '')">Ban</button>
                                    </div><!--/ Help Text -->

                                </div>
                            </section>
                        </div>
                        <!--/ END Default Widget -->
                    </div>
                    <!--/ END Row -->

                </div>
                <!--/ END Content -->

                <!-- START Content - OTHER_FILES -->
                <div class="container-fluid" ng-show="page == 'otherfiles'">


                </div>
                <!--/ END Content -->

            <!-- Modal With Animation -->
            <div id="modal_locales" class="modal hide fade">
                <div class="modal-header">
                    <h4 translate="CHANGE_LOCALE"></h4>
                </div>
                <div class="modal-body">
                  <!-- Select -->
                  <div class="control-group">
                      <div class="controls">
                          <select class="span2" ng-model="preferred_locale">
                              <option value="en_US">en_US</option>
                              <option value="de_DE">de_DE</option>
                              <option value="fr_FR">fr_FR</option>
                              <option value="sv_SE">sv_SE</option>
                          </select>
                      </div>
                  </div>
                  <!--/ Select -->
                </div>
            </div><!--/ Modal With Animation -->

            <!-- Modal With Animation -->
            <div id="modal_sp" class="modal hide fade">
                <div class="modal-header">
                    <h4 translate="ADD_SP_ATTRIBUTE"></h4>
                </div>
                <div class="modal-body">
                    <p translate="SP_DESCRIPTION"></p>
                    <input type="text" class="" ng-model="sp.new_attribute" placeholder="announce-player-achievements"> = <input type="text" class="" ng-model="sp.new_value" placeholder="true">
                </div>
                <div class="modal-footer">
                    <button class="btn btn-primary" data-dismiss="modal" translate="SP_ADD" ng-disabled="!sp.new_attribute" ng-click="modals.close_add_sp()"></button>
                </div>
            </div><!--/ Modal With Animation --> 

            <!-- Modal With Animation -->
            <div id="modal_eula" class="modal hide fade">
                <div class="modal-header">
                    <h4 translate="EULA_DETECTED"></h4>
                </div>
                <div class="modal-body">
                    <p translate="EULA_MUST_BE_ACCEPTED"></p>
                    <p><a href="https://account.mojang.com/documents/minecraft_eula" translate="READ_THE_EULA"></a></p>
                </div>
                <div class="modal-footer">
                    <button class="btn" aria-hidden="true" translate="ACCEPT_EULA" ng-click="server_command('accept_eula')" ng-class="{'btn-default': servers[current].page_data.glance.eula != false, 'btn-primary': servers[current].page_data.glance.eula == false}"></button>
                    <button class="btn btn-warning" data-dismiss="modal" translate="KILL" ng-click="server_command('kill')" ng-show="servers[current].heartbeat.up"></button>
                    <button class="btn btn-warning" data-dismiss="modal" translate="RESTART" ng-click="modals.close_accept_eula_restart()" ng-show="servers[current].heartbeat.up"></button>
                    <button class="btn btn-warning" data-dismiss="modal" translate="START" ng-click="modals.close_accept_eula_start()" ng-show="!servers[current].heartbeat.up"></button>
                </div>
            </div><!--/ Modal With Animation --> 

            <!-- Modal With Animation -->
            <div id="modal_new_server" class="modal hide fade">
                <div class="modal-header">
                    <h4 translate="STARTING_A_NEW_SERVER"></h4>
                </div>
                <div class="modal-body">
                    <p translate="NEW_SERVER_OVERVIEW"></p>
                    <div class="controls">
                        <select class="" ng-model="myprofile" default-option="Select a profile" data-ng-options="p as p.id group by p.group for p in profiles | profile_downloaded: 'only_downloaded' | orderBy:'-releaseTime'" ng-change="change_sc('minecraft', 'profile', myprofile.id)">
                            <option value="" disabled selected translate="CHANGE_PROFILE_TO"></option>
                        </select>
                        <!-- Select -->
                        <div class="control-group">
                            <div class="controls">
                                <select class="" ng-model="myjarfile" data-ng-options="j for j in servers[current].page_data.glance.server_files" ng-change="change_sc('java', 'jarfile', myjarfile)">
                                    <option value="" disabled selected translate="CHANGE_JARFILE_TO"></option>
                                </select>
                            </div>
                        </div><!--/ Select -->
                    </div>
                    <div class="controls">
                        <label class="control-label" translate="MEMORY_ALLOCATION"></label>
                        <!-- Help Text -->
                        <div class="control-group">
                            <div class="controls">
                                <div class="input-prepend input-append">
                                    <span class="add-on" translate="JAVA_XMX"></span>
                                    <input type="text" 
                                        ng-model="servers[current].sc.java.java_xmx" 
                                        ng-change="change_sc('java', 'java_xmx', servers[current].sc.java.java_xmx)" 
                                        ng-model-options="{ updateOn: 'default blur', debounce: {'default': 1500, 'blur': 0} }">
                                    <span class="add-on" translate="MB_ABBREVIATION"></span>
                                </div>
                            </div>
                            <div class="controls">
                                <div class="input-prepend input-append">
                                    <span class="add-on" translate="JAVA_XMS"></span>
                                    <input type="text" 
                                        ng-model="servers[current].sc.java.java_xms" 
                                        ng-change="change_sc('java', 'java_xms', servers[current].sc.java.java_xms)"
                                        ng-model-options="{ updateOn: 'default blur', debounce: {'default': 1500, 'blur': 0} }">
                                    <span class="add-on" translate="MB_ABBREVIATION"></span>
                                </div>
                            </div>
                        </div><!--/ Help Text -->
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-success" ng-click="modals.close_new_server_start()" translate="START"></button>
                </div>
            </div><!--/ Modal With Animation --> 

            <!-- Modal With Animation -->
            <div id="modal_server_from_archive" class="modal hide fade">
                <div class="modal-header">
                    <h4 translate="CREATE_SERVER_FROM_ARCHIVE"></h4>
                </div>
                <div class="modal-body">
                    <p translate="SERVER_FROM_ARCHIVE_DESC"></p>
                    <input type="text" class="span2" ng-model="new_server_name">
                </div>
                <div class="modal-footer">
                    <button class="btn btn-success" aria-hidden="true" translate="CREATE_FROM_ARCHIVE" ng-click="server_from_archive_create()"></button>
                </div>
            </div><!--/ Modal With Animation --> 

            <!-- Modal With Animation -->
            <div id="modal_spigotjar" class="modal hide fade">
                <div class="modal-header">
                    <h4 translate="SPIGOT_CRAFTBUKKIT"></h4>
                </div>
                <div class="modal-body">
                    <p translate="JAR_COPY_DESC"></p>
                    <!-- Select -->
                        <div class="control-group">
                            <div class="controls">
                                <select class="span2" ng-model="server_target" ng-options="name as name for (name, instance) in servers | membership">
                                </select>
                            </div>
                        </div>
                    <!--/ Select -->
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-success" ng-click="modals.close_copy_to_server(server_target, jar.id)" translate="COPY_TO_SERVER"></button>
                </div>
            </div><!--/ Modal With Animation --> 

            </section>
            <!--/ END Template Main Content -->

            <!-- START Template Footer -->
            <footer id="footer">
                <p translate="CREDITS"></p>

                <!-- START To Top Scroller -->
                <a href="#" class="totop"><span class="icon icone-angle-up"></span></a>
                <!--/ END To Top Scroller -->
            </footer>
            <!--/ END Template Footer -->
        </div>
        <!--/ END Template Canvas -->
    </div>
    <!--/ END Template Wrapper -->

    <!-- IMPORTANT! : All the available plugin will be loaded at once -->
    <!-- START JAVASCRIPT SECTION - Include at the bottom of the page to reduce load time -->
    <!-- Javascript(Vendors) -->
    <script src="assets/jquery/js/jquery-2.1.4.min.js"></script>
    <script src="assets/jui/js/jquery-ui-1.10.3.min.js"></script>
    <!--/ Javascript(Vendors) -->

    <!-- Javascript(Plugins) -->
    <script src="assets/bootstrap/js/bootstrap.min.js"></script>
    <script src="assets/datatable/js/jquery.dataTables.min.js"></script>
    <script src="assets/datatable/js/dataTables-bootstrap.min.js"></script>
    <script src="assets/easypiechart/js/jquery.easypiechart.min.js"></script>
    <script src="assets/formwizard/js/jquery.formwizard.min.js"></script>
    <script src="assets/fullcalendar/js/fullcalendar.min.js"></script>
    <script src="assets/ie-placeholder/js/jquery.placeholder.min.js"></script>
    <script src="assets/inputmask/js/jquery.inputmask.min.js"></script>
    <script src="assets/select2/js/select2.min.js"></script>
    <script src="assets/sparkline/js/jquery.sparkline.min.js"></script>
    <script src="assets/gritter/js/jquery.gritter.min.js"></script>
    <script src="assets/resize/js/jquery.ba-resize.min.js"></script>

    <!-- Form Validation -->
    <script src="assets/formvalidation/bassistance/js/jquery.validate.min.js"></script>
    <script src="assets/formvalidation/validationengine/js/lang/jquery.validationEngine-en.min.js"></script>
    <script src="assets/formvalidation/validationengine/js/jquery.validationEngine.min.js"></script>

    <!-- Chart -->
    <script src="assets/flot/jquery.flot.min.js"></script>
    <script src="assets/flot/jquery.flot.pie.min.js"></script>
    <script src="assets/flot/jquery.flot.categories.min.js"></script>
    <script src="assets/flot/jquery.flot.tooltip.min.js"></script>
    <script src="assets/flot/jquery.flot.resize.min.js"></script>
    <script src="assets/flot/excanvas.min.js"></script>
    <!--/ Javascript(Plugins) -->

    <!-- Javascript (Application) -->
    <script src="/socket.io/socket.io.js"></script>
    <script src="/moment/min/moment.min.js"></script>
    <script src="/angular/angular.min.js"></script>
    <script src="/angular-translate/angular-translate.min.js"></script>
    <script src="/angular-translate/angular-translate-loader-static-files/angular-translate-loader-static-files.min.js"></script>
    <script src="/angular-moment/angular-moment.min.js"></script>
    <script src="/angular-moment-duration-format/moment-duration-format.js"></script>
    <script src="/angular-sanitize/angular-sanitize.min.js"></script>
    <script src="js/scriptin.js"></script>
    <script src="js/plugins.js"></script>
    <script src="js/application.js"></script>
    <script src="js/easypiechart.sample.js"></script>
    <!--/ Javascript (Application) -->
    <!--/ END JAVASCRIPT SECTION -->
</body>
</html>
{
  "WEBSITE_TITLE": "MineOS Web-Oberfläche",
  "NOTIFICATIONS": "Benachrichtigungen",
  "REFRESH_SERVER_LIST": "Refresh Server List",
  "REFRESH_PROFILE_LIST": "Refresh Profile List",
  "LOG_OFF": "Log Off",

  "HOST_SETTINGS": "MineOS-Einstellungen",
  "DASHBOARD": "Übersicht",
  "CREATE_NEW_SERVER": "Neuen Server erstellen",
  "IMPORT_SERVER": "Import a Server",
  "PROFILES": "Profile",
  "BUILDTOOLS": "BuildTools",
  "CALENDAR": "Kalender",

  "SERVER_SETTINGS": "Server-Einstellungen",
  "SERVER_STATUS": "Server Status",
  "BACKUPS_AND_RESTORES": "Backup und Wiederherstellung",
  "SERVER.PROPERTIES": "server.properties",
  "RESTORE_POINT": "Wiederherstellungspunkt",
  "RESTORE_POINTS": "Wiederherstellung",
  "ARCHIVES": "Archive",
  "SCHEDULING": "Aufgabenplanung",
  "CONFIGURATION": "Konfiguration",
  "JAVA": "Java",
  "GAME_MAINTENANCE": "Wartung",
  "LOGGING": "Logging",
  "CONSOLE": "Console",
  "OTHER_FILES": "Andere Dateien",
  "PLAYER_INTERACTION": "Player Interaction",

  "CURRENTLY_SELECTED_SERVER": "Ausgewählter Server",
  "SERVER_OVERVIEW": "Server Übersicht",
  "SERVERS_RUNNING": "Server Online",
  "PLAYERS_ONLINE": "Spieler Online",
  "UPTIME": "Uptime",
  "RAM_FREE": "Freier Speicher (RAM)",

  "LOAD_AVERAGES": "Serverlast (CPU)",
  "SERVER": "Server",
  "TYPE": "Typ",
  "PORT": "Port",
  "STATUS": "Status",
  "MEMORY": "Speicher",
  "UP": "Up",
  "DOWN": "Down",

  "SERVER_NAME": "Server Name",
  "CREATE_HELP": "Erlaubt sind Buchstaben, Ziffern und _ (Unterstriche).",
  "UNCONVENTIONAL_SERVER_TYPE": "This is an unconventional server, such as a proxy/load balancing server.",

  "OFFICIAL_MOJANG_SERVER_JARS": "Offizielle Mojang Serverprofile",
  "AVAILABLE_SERVER_JARS": "Available Server Jars/Packs",
  "IDENTIFIER": "ID",
  "RELEASE_TIMESTAMP": "Release vom",
  "RELEASE_TYPE": "Release Typ",
  "RELEASE": "Release",
  "OLD_VERSION": "Old Version",
  "SNAPSHOT": "Snapshot",
  "SHOW_ALL_RELEASES": "Alle anzeigen",
  "DOWNLOADED_PROFILES": "Heruntergeladene Profile",
  "CURRENTLY_USING_PROFILE": "Derzeit verwendetes Profil:",
  "PROFILE": "Profil",
  "PROFILE_DESC": "Profile Description",
  "DOWNLOADED": "Downloaded",

  "SPIGOT_CRAFTBUKKIT": "Spigot / Craftbukkit",
  "BUILDTOOLS_INSTRUCTIONS": "Download the latest BuildTools.jar and then select Minecraft version to compile Spigot/Craftbukkit with. Once complete, copy the compiled server jars to any server.",
  "DOWNLOAD_BUILDTOOLS": "Download latest BuildTools.jar",
  "BUILD_JAR": "Build Jarfile",
  "SELECT_BUILDTOOLS": "Select BuildTools.jar version",
  "OUTPUT_FROM_BUILDTOOLS": "Output from BuildTools.jar",
  "JAR_COPY_DESC": "Copy compiled binaries to server directory",
  "COPY_TO_SERVER": "Copy to Server",

  "GLANCE": "Server-Details",
  "VERSION": "Version",
  "REPORTED_VERSION": "Interne Version",
  "MEMORY_FOOTPRINT": "Speicherverbrauch (RAM)",

  "SERVER_ACTIONS": "Server-Kommandos",
  "START": "Start",
  "STOP": "Stop",
  "RESTART": "Neustart",
  "STOP_AND_BACKUP": "Stop mit Backup",
  "KILL": "Kill",
  "BROADCAST_TO_LAN": "Im LAN veröffentlichen",
  "START_ON_BOOT": "Start server on boot",
  "UNCONVENTIONAL_SERVER": "This is not a conventional Minecraft server",
  "COPY_PROFILE": "Copy profile to live server files",

  "JAVA_SETTINGS": "Java Settings",
  "MEMORY_ALLOCATION": "RAM Einstellungen (Heapsize)",
  "JAVA_XMX": "-Xmx",
  "JAVA_XMS": "-Xms",
  "MB_ABBREVIATION": "MB",
  "SELECT_SERVER_PROFILE": "Serverprofil auswählen",
  "CHANGE_PROFILE_TO": "Change profile to:",
  "CHANGE_JARFILE_TO": "Change runnable jar to:",
  "ADDITIONAL_JAVA_ARGS": "Additional Java arguments:",
  "ADDITIONAL_JAR_ARGS": "Additional Jar arguments:",

  "MOST_RECENT_RESTORE_POINT": "Jüngster Wiederherstellungspunkt",
  "OLDEST_RESTORE_POINT": "Ältester Wiederherstellungspunkt",
  "SPACE_USED_RESTORES": "Festplattenplatz benötigt (Alle Wiederherstellungspunkte)",
  "SUCCESS": "Erfolgreich",
  "RESTORE_POINT_CREATED": "Wiederherstellungspunkt erstellt",
  "FAILURE": "Oh-oh!",
  "RESTORE_POINT_FAILED": "Wiederherstellungspunkt: Erstellung fehlgeschlagen",
  "CREATE_NEW_RESTORE_POINT": "Neuen Wiederherstellungspunkt erstellen",

  "MOST_RECENT_ARCHIVE": "Jüngstes Archiv",
  "OLDEST_ARCHIVE": "Ältestes Archiv",
  "SPACE_USED_ARCHIVES": "Festplattenplatz benötigt (Alle Archive)",
  "ARCHIVE_CREATED": "Archiv erstellt",
  "ARCHIVE_FAILED": "Archiv: Erstellung fehlgeschlagen",
  "CREATE_NEW_ARCHIVE": "Neues Archiv erstellen",

  "OWNERSHIP_AND_DISK_USAGE": "Besitzrechte und Festplatten",
  "SERVER_OWNER": "Besitzer Server (unix owner)",
  "GROUP_OWNER": "Besitzer Gruppe (unix owner)",
  "SPACE_USED_LIVE": "Festplattenplatz für reine Serverdateien",

  "DELETE_SERVER": "Server löschen",
  "DELETE": "Löschen",
  "EDIT": "Bearbeiten",
  "SETTINGS": "Einstellungen",
  "DELETE_ARCHIVES": "Delete Archives:",
  "DELETE_RESTORE_POINTS": "Delete Restore Points:",
  "DELETE_LIVE_FILES": "Delete Live Server Files:",

  "AVAILABLE_RESTORE_POINTS": "Verfügbare Wiederherstellungspunkte",
  "STEP": "ID",
  "TIMESTAMP": "Zeitstempel",
  "SIZE": "Größe",
  "CUMULATIVE_SIZE": "Größe kumulativ",
  "RESTORE": "Wiederherstellen",
  "PRUNE": "Prune older than this",

  "AVAILABLE_ARCHIVES": "Verfügbare Archive",
  "FILENAME": "Dateiname",
  "ACTIONS": "Kommandos",
  "DELETE_THIS_ARCHIVE": "Archiv löschen",
  "CREATE_FROM_ARCHIVE": "Neuen Server aus Archiv erstellen",

  "CRONTAB_SCHEDULE": "Aufgabenplanung (Crontab)",
  "CRON_EXPRESSION": "Crontab Einstellung",
  "COMMAND_TO_RUN": "Auszuführender Befehl",
  "SEND_TO_CONSOLE": "An Konsole senden",
  "ADDITIONAL_ARGUMENT": "Zusätzliches Argument",
  "SUBMIT_CRONJOB": "Cronjob einstellen",
  "SUSPEND": "Cronjob aussetzen (anhalten)",

  "CREDITS": "MineOS - erstellt und gewartet von William Dizon und Mitwirkenden",

  "CHANGE_LOCALE": "Change Localization",

  "EULA_DETECTED": "Minecraft EULA",
  "EULA_MUST_BE_ACCEPTED": "Mojang erwartet von Server-Admins, dass diese die Minecraft EULA akzeptieren, bevor ein Server gestartet werden kann. Dies erfolgt, indem in der Datei 'eula.txt' im Hauptverzeichnis des Servers der Wert 'eula=false' in 'eula=true' geändert wird.",
  "ACCEPT_EULA": "Minecraft EULA akzeptieren",
  "READ_THE_EULA": "Minecraft EULA lesen",

  "STARTING_A_NEW_SERVER": "Starting a new server",
  "NEW_SERVER_OVERVIEW": "Starting a new server requires at least the following initial configuration: a runnable server JAR and the Java maximum heap size. Select a profile to expand additional JAR files.",

  "CREATE_SERVER_FROM_ARCHIVE": "Neuen Server aus einem bestehenden Archiv erstellen",
  "SERVER_FROM_ARCHIVE_DESC": "Bitte den Namen des neuen Servers eingeben",

  "ADD_SP_ATTRIBUTE": "Add new attribute",
  "SP_DESCRIPTION": "Add a new attribute/value pair to server.properties.",
  "SP_ADD": "Add",

  "SUCCEEDED": "erfolgreich",
  "FAILED": "fehlgeschlagen",
  "!up": "Für diese Aktion darf der Server nicht online sein.",
  "up": "Server muss für diese Aktion online sein.",
  "!exists": "Server darf bei dieser Aktion noch nicht existieren.",
  "exists": "Server nicht gefunden. Dieser muss existieren, um das gewählte Kommando darauf auszuführen.",
  "eula": "The Mojang End-User Licesnce Agreement must be accepted to start this server."
}
{
  "WEBSITE_TITLE": "MineOS Web User Interface",
  "NOTIFICATIONS": "Notifications",
  "REFRESH_SERVER_LIST": "Refresh Server List",
  "REFRESH_PROFILE_LIST": "Refresh Profile List",
  "LOG_OFF": "Log Off",

  "HOST_SETTINGS": "Host Settings",
  "DASHBOARD": "Dashboard",
  "CREATE_NEW_SERVER": "Create New Server",
  "IMPORT_SERVER": "Import a Server",
  "PROFILES": "Profiles",
  "BUILDTOOLS": "BuildTools",
  "CALENDAR": "Calendar",

  "SERVER_SETTINGS": "Server Settings",
  "SERVER_STATUS": "Server Status",
  "BACKUPS_AND_RESTORES": "Backups and Restores",
  "SERVER.PROPERTIES": "server.properties",
  "RESTORE_POINT": "Restore point",
  "RESTORE_POINTS": "Restore Points",
  "ARCHIVES": "Archives",
  "SCHEDULING": "Scheduling",
  "CONFIGURATION": "Configuration",
  "JAVA": "Java",
  "GAME_MAINTENANCE": "Game Maintenance",
  "LOGGING": "Logging",
  "CONSOLE": "Console",
  "OTHER_FILES": "Other Files",
  "PLAYER_INTERACTION": "Player Interaction",

  "CURRENTLY_SELECTED_SERVER": "Currently Selected Server",
  "SERVER_OVERVIEW": "Server Overview",
  "SERVERS_RUNNING": "Servers Running",
  "PLAYERS_ONLINE": "Players Online",
  "UPTIME": "Uptime",
  "RAM_FREE": "RAM FREE",

  "LOAD_AVERAGES": "Load Averages",
  "SERVER": "Server",
  "TYPE": "Type",
  "PORT": "Port",
  "STATUS": "Status",
  "MEMORY": "Memory",
  "UP": "Up",
  "DOWN": "Down",

  "SERVER_NAME": "Server Name",
  "CREATE_HELP": "Only letters, numbers and underscores.",
  "UNCONVENTIONAL_SERVER_TYPE": "This is an unconventional server, such as a proxy/load balancing server.", 

  "OFFICIAL_MOJANG_SERVER_JARS": "Official Mojang Server Jars",
  "AVAILABLE_SERVER_JARS": "Available Server Jars/Packs",
  "IDENTIFIER": "ID",
  "RELEASE_TIMESTAMP": "Release Timestamp",
  "RELEASE_TYPE": "Release Type",
  "RELEASE": "Release",
  "OLD_VERSION": "Old Version",
  "SNAPSHOT": "Snapshot",
  "SHOW_ALL_RELEASES": "Show All",
  "DOWNLOADED_PROFILES": "Downloaded Profiles",
  "CURRENTLY_USING_PROFILE": "Currently using profile:",
  "PROFILE": "Profile",
  "PROFILE_DESC": "Profile Description",
  "DOWNLOADED": "Downloaded",

  "SPIGOT_CRAFTBUKKIT": "Spigot / Craftbukkit",
  "BUILDTOOLS_INSTRUCTIONS": "Download the latest BuildTools.jar and then select Minecraft version to compile Spigot/Craftbukkit with. Once complete, copy the compiled server jars to any server.",
  "DOWNLOAD_BUILDTOOLS": "Download latest BuildTools.jar",
  "BUILD_JAR": "Build Jarfile",
  "SELECT_BUILDTOOLS": "Select BuildTools.jar version",
  "OUTPUT_FROM_BUILDTOOLS": "Output from BuildTools.jar",
  "JAR_COPY_DESC": "Copy compiled binaries to server directory",
  "COPY_TO_SERVER": "Copy to Server",

  "GLANCE": "Server at a Glance", 
  "VERSION": "Version",
  "REPORTED_VERSION": "Ping Version",
  "MEMORY_FOOTPRINT": "Memory Footprint",

  "SERVER_ACTIONS": "Server Actions",
  "START": "Start",
  "STOP": "Stop",
  "RESTART": "Restart",
  "STOP_AND_BACKUP": "Stop and Backup",
  "KILL": "Kill",
  "BROADCAST_TO_LAN": "Broadcast to LAN",
  "START_ON_BOOT": "Start server on boot",
  "UNCONVENTIONAL_SERVER": "This is not a conventional Minecraft server",
  "COPY_PROFILE": "Copy profile to live server files",

  "JAVA_SETTINGS": "Java Settings",
  "MEMORY_ALLOCATION": "Memory Allocation (Heapsize)",
  "JAVA_XMX": "-Xmx",
  "JAVA_XMS": "-Xms",
  "MB_ABBREVIATION": "MB",
  "SELECT_SERVER_PROFILE": "Select server profile",
  "CHANGE_PROFILE_TO": "Change profile to:",
  "CHANGE_JARFILE_TO": "Change runnable jar to:",
  "ADDITIONAL_JAVA_ARGS": "Additional Java arguments:",
  "ADDITIONAL_JAR_ARGS": "Additional Jar arguments:",

  "MOST_RECENT_RESTORE_POINT": "Most recent restore point",
  "OLDEST_RESTORE_POINT": "Oldest restore point",
  "SPACE_USED_RESTORES": "Space used by restore points",
  "SUCCESS": "Success",
  "RESTORE_POINT_CREATED": "Restore point created",
  "FAILURE": "Uh oh!",
  "RESTORE_POINT_FAILED": "Restore point attempt failed",
  "CREATE_NEW_RESTORE_POINT": "Create a new restore point",

  "MOST_RECENT_ARCHIVE": "Most recent archive",
  "OLDEST_ARCHIVE": "Oldest Archive",
  "SPACE_USED_ARCHIVES": "Space used by archives",
  "ARCHIVE_CREATED": "Archive created",
  "ARCHIVE_FAILED": "Archive attempt failed",
  "CREATE_NEW_ARCHIVE": "Create a new archive",

  "OWNERSHIP_AND_DISK_USAGE": "Ownership and Disk Usage",
  "SERVER_OWNER": "Server Owner",
  "GROUP_OWNER": "Group Owner",
  "SPACE_USED_LIVE": "Space used by live server files",

  "DELETE_SERVER": "Delete Server",
  "DELETE": "Delete",
  "EDIT": "Edit",
  "SETTINGS": "Settings",
  "DELETE_ARCHIVES": "Delete Archives:",
  "DELETE_RESTORE_POINTS": "Delete Restore Points:",
  "DELETE_LIVE_FILES": "Delete Live Server Files:",

  "AVAILABLE_RESTORE_POINTS": "Available Restore Points",
  "STEP": "Step",
  "TIMESTAMP": "Timestamp",
  "SIZE": "Size",
  "CUMULATIVE_SIZE": "Cumulative Size",
  "RESTORE": "Restore",
  "PRUNE": "Prune older than this",

  "AVAILABLE_ARCHIVES": "Available Archives",
  "FILENAME": "Filename",
  "ACTIONS": "Actions",
  "DELETE_THIS_ARCHIVE": "Delete this Archive",
  "CREATE_FROM_ARCHIVE": "Create server from Archive",

  "CRONTAB_SCHEDULE": "Crontab Schedule",
  "CRON_EXPRESSION": "Cron Expression",
  "COMMAND_TO_RUN": "Command to run",
  "SEND_TO_CONSOLE": "Send to console",
  "ADDITIONAL_ARGUMENT": "Additional argument",
  "SUBMIT_CRONJOB": "Submit cronjob",
  "SUSPEND": "Suspend",

  "CREDITS": "MineOS created and maintained by William Dizon",

  "CHANGE_LOCALE": "Change Localization",

  "EULA_DETECTED": "Minecraft EULA",
  "EULA_MUST_BE_ACCEPTED": "Mojang requires Minecraft server admins to accept the End User License Agreement before hosting a Minecraft server. This is done by changing 'eula=false' to 'eula=true' in eula.txt in your server root.",
  "ACCEPT_EULA": "Accept EULA",
  "READ_THE_EULA": "Read the Minecraft EULA",

  "STARTING_A_NEW_SERVER": "Starting a new server",
  "NEW_SERVER_OVERVIEW": "Starting a new server requires at least the following initial configuration: a runnable server JAR and the Java maximum heap size. Select a profile to expand additional JAR files.",

  "CREATE_SERVER_FROM_ARCHIVE": "Create a new server from an existing archive",
  "SERVER_FROM_ARCHIVE_DESC": "Please type in the name of the new server to create",

  "ADD_SP_ATTRIBUTE": "Add new attribute",
  "SP_DESCRIPTION": "Add a new attribute/value pair to server.properties.",
  "SP_ADD": "Add",

  "SUCCEEDED": "succeeded",
  "FAILED": "failed",
  "!up": "Server may not be up when performing this action.",
  "up": "Server must be up when performing this action.",
  "!exists": "Server may not exist when performing this action.",
  "exists": "Cannot find server to act on.",
  "eula": "The Mojang End-User Licesnce Agreement must be accepted to start this server."
}
/*----------------------------------------------------*/
/*  Sidebar Scrollable
/*----------------------------------------------------*/
$(function () {
    if(jQuery().perfectScrollbar) {
    	$('#sidebar').perfectScrollbar();
    }
});

/*----------------------------------------------------*/
/*  Sidebar toggler
/*----------------------------------------------------*/
$(function () {
	$('[data-toggle="sidebar"]').click(function (e) {

		$(this).toggleClass('active');
		$('html').toggleClass('nav-open');

		e.preventDefault();
	});
});

/*----------------------------------------------------*/
/*  Sidebar Height - ie8 Fix
/*----------------------------------------------------*/
$(function () {
	if($('html').hasClass('lt-ie9')) {
		$('#sidebar').css('min-height', $('#main').height());
	}
	$('#sidebar').resize(function(){
		var $this = $(this);
		$('#main').css('min-height', $this.height());
	});
	$('#sidebar').resize();
});

/*----------------------------------------------------*/
/*  Widget Collapse
/*----------------------------------------------------*/
$(function () {
	$('.toolbar [data-toggle="collapse"]').on('click', function (e) {
		$icon = $(this).children('.icon');

		if($(this).hasClass('collapsed')) {
			$icon.removeClass('icone-chevron-down').addClass('icone-chevron-up');
		}else{
			$icon.removeClass('icone-chevron-up').addClass('icone-chevron-down');
		}
		e.preventDefault();
	});
});

/*----------------------------------------------------*/
/*  Widget Refresh Modal
/*----------------------------------------------------*/
$(function () {
	$('[data-widget="refresh"]').on('click', function (e) {
		var $modal = $('<div class="widget-modal"><span class="spinner spinner1"></span></div>');
		var $target = $(this).parents('.widget');

		// append to widget
		$target.append($modal);

		// remove after 3 second
		setTimeout(function () {
	        $modal.remove();
	    }, 2000);

		e.preventDefault();
	});
});

/*----------------------------------------------------*/
/*  Application Color
/*----------------------------------------------------*/
var $color = [];

// Application color as in version 1.0.0
$color['red'] = '#dc143c';
$color['teal'] = '#00A0B1';
$color['blue'] = '#2E8DEF';
$color['purple'] = '#A700AE';
$color['magenta'] = '#FF0097';
$color['lime'] = '#8CBF26';
$color['brown'] = '#A05000';
$color['pink'] = '#E671B8';
$color['orange'] = '#F09609';
$color['green'] = '#3A9548';
$color['yellow'] = '#E1B700';

/*----------------------------------------------------*/
/*  To Top Scroller
/*----------------------------------------------------*/
$(function () {
	$('.totop').click(function (e){
		$("html, body").animate({ scrollTop: 0 }, 600);
		
		e.preventDefault();
	});
});

/*----------------------------------------------------*/
/*  Jquery Easy Pie Chart
/* 	http://rendro.github.io/easy-pie-chart/
/*----------------------------------------------------*/
$(function() {
	if(jQuery().easyPieChart) {
		$('.gauge-red').easyPieChart({
			barColor: $color['red'],
			scaleColor: false,
			trackColor: '#999',
			lineCap: 'butt',
			lineWidth: 4,
			size: 50,
			animate: 1000
		});

		$('.gauge-teal').easyPieChart({
			barColor: $color['teal'],
			scaleColor: false,
			trackColor: '#999',
			lineCap: 'butt',
			lineWidth: 4,
			size: 50,
			animate: 1000
		});

		$('.gauge-blue').easyPieChart({
			barColor: $color['blue'],
			scaleColor: false,
			trackColor: '#999',
			lineCap: 'butt',
			lineWidth: 4,
			size: 50,
			animate: 1000
		});

		$('.gauge-purple').easyPieChart({
			barColor: $color['purple'],
			scaleColor: false,
			trackColor: '#999',
			lineCap: 'butt',
			lineWidth: 4,
			size: 50,
			animate: 1000
		});

		$('.gauge-magenta').easyPieChart({
			barColor: $color['magenta'],
			scaleColor: false,
			trackColor: '#999',
			lineCap: 'butt',
			lineWidth: 4,
			size: 50,
			animate: 1000
		});

		$('.gauge-lime').easyPieChart({
			barColor: $color['lime'],
			scaleColor: false,
			trackColor: '#999',
			lineCap: 'butt',
			lineWidth: 4,
			size: 50,
			animate: 1000
		});

		$('.gauge-brown').easyPieChart({
			barColor: $color['brown'],
			scaleColor: false,
			trackColor: '#999',
			lineCap: 'butt',
			lineWidth: 4,
			size: 50,
			animate: 1000
		});

		$('.gauge-pink').easyPieChart({
			barColor: $color['pink'],
			scaleColor: false,
			trackColor: '#999',
			lineCap: 'butt',
			lineWidth: 4,
			size: 50,
			animate: 1000
		});

		$('.gauge-orange').easyPieChart({
			barColor: $color['orange'],
			scaleColor: false,
			trackColor: '#999',
			lineCap: 'butt',
			lineWidth: 4,
			size: 50,
			animate: 1000
		});

		$('.gauge-green').easyPieChart({
			barColor: $color['green'],
			scaleColor: false,
			trackColor: '#999',
			lineCap: 'butt',
			lineWidth: 4,
			size: 50,
			animate: 1000
		});

		$('.gauge-yellow').easyPieChart({
			barColor: $color['yellow'],
			scaleColor: false,
			trackColor: '#999',
			lineCap: 'butt',
			lineWidth: 4,
			size: 50,
			animate: 1000
		});
	}
});
RawBlameHistory     601 lines (561 sloc)  18.1 KB
/*----------------------------------------------------*/
/*  Avoid `console` errors
/*----------------------------------------------------*/
(function () {
    var method;
    var noop = function () {};
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});

    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }
}());

/*----------------------------------------------------*/
/*  Internet Explorer Placeholder
/*----------------------------------------------------*/
$(function () {
    if(jQuery().placeholder) {
        $('input, textarea').placeholder();
    }
});

/*----------------------------------------------------*/
/*  Bootstrap Tooltip
/*----------------------------------------------------*/
$(function () {
    if(jQuery().tooltip) {
        $('[rel="tooltip"]').tooltip();
    }
});

/*----------------------------------------------------*/
/*  Widget Scrollable Content
/*----------------------------------------------------*/
$(function () {
    if(jQuery().perfectScrollbar) {
        $('#demo1').perfectScrollbar();
        $('#demo2').perfectScrollbar();
        $('#demo3').perfectScrollbar();
        $('#demo4').perfectScrollbar();
        $('#demo5').perfectScrollbar();
    }
});

/*----------------------------------------------------*/
/*  Bootstrap Popover
/*----------------------------------------------------*/
$(function () {
    if(jQuery().popover) {
        $('[rel="popover"]').popover({
            trigger : 'hover'
        });
    }
});

/*----------------------------------------------------*/
/*  Snippet - Syntax Highlighter
/*  http://www.steamdev.com/snippet/
/*----------------------------------------------------*/
$(function () {
    if(jQuery().snippet) {
        $("pre.php").snippet("php",{style:"bright"});
    }
});

/*----------------------------------------------------*/
/*  iCheck - Checkbox & Radio styling
/*  http://damirfoy.com/iCheck/
/*----------------------------------------------------*/
$(function () {
    if(jQuery().iCheck) {
        $('input[type="checkbox"], input[type="radio"]').not('.nostyle').iCheck({
            checkboxClass: 'icheckbox_minimal-grey',
            radioClass: 'iradio_minimal-grey',
            increaseArea: '20%' // optional
        });
    }
});

/*----------------------------------------------------*/
/*  Filestyle - Custom File Input
/*  http://markusslima.github.io/bootstrap-filestyle
/*----------------------------------------------------*/
$(function () {
    if(jQuery().filestyle) {
        $(":file").filestyle({ 
            icon: true 
        });
    }
});

/*----------------------------------------------------*/
/*  Tags It
/*  http://aehlke.github.io/tag-it/
/*----------------------------------------------------*/
$(function () {
    if(jQuery().tagit) {
        $('#tags').tagit();
    }
});

/*----------------------------------------------------*/
/*  Input Mask
/*  http://digitalbush.com/projects/masked-input-plugin/
/*----------------------------------------------------*/
$(function () {
    if(jQuery().mask) {
        $('[input-mask="date"]').mask("99/99/9999");
        $('[input-mask="phone"]').mask("(999) 999-9999");
        $('[input-mask="tin"]').mask("99-9999999");
        $('[input-mask="ssn"]').mask("999-99-9999");
    }
});

/*----------------------------------------------------*/
/*  Form Wizard
/*  http://thecodemine.org/
/*----------------------------------------------------*/
$(function(){
    if(jQuery().formwizard) {
        $("#formwizard1").formwizard({ 
            disableUIStyles: true,
            focusFirstInput : true
        });
        $("#formwizard2").formwizard({ 
            disableUIStyles: true,
            validationEnabled: true
        });
    }
});

/*----------------------------------------------------*/
/*  Select2 - Advanced Select
/*  http://ivaynberg.github.io/select2/
/*----------------------------------------------------*/
$(function () {
    if(jQuery().select2) {
        $("#select2_1").select2({
            placeholder: "Select a State"
        });
        $("#select2_2").select2({
            placeholder: "Select a State",
            allowClear: true
        });
        $("#select2_3").select2({
            minimumInputLength: 2
        });
        $("#select2_4").select2({
            tags: ["red", "green", "blue", "yellow", "purple", "brown"]
        });
        $(".frequencies").select2({
            tags: ["1 hour", "2 hours", "3 hours", "4 hours", "6 hours", "12 hours", "1 day", "2 days", "3 days", "7 days"]
        });
    }
});

/*----------------------------------------------------*/
/*  Minicolor - Color Picker
/*  http://www.abeautifulsite.net/blog/2011/02/jquery-minicolors-a-color-selector-for-input-controls
/*----------------------------------------------------*/
$(function () {
    if(jQuery().minicolors) {
        $('#minicolor_1').minicolors({
            theme: 'default'
        });
        $('#minicolor_2').minicolors({
            theme: 'bootstrap'
        });
        $('#minicolor_3').minicolors({
            textfield: false
        });
        $('#minicolor_4').minicolors({
            control: 'wheel'
        });
    }
});

/*----------------------------------------------------*/
/*  Timepicker - Bootstrap Timepicker
/*  http://jdewit.github.io/bootstrap-timepicker/
/*----------------------------------------------------*/
$(function () {
    if(jQuery().timepicker) {
        $('#timepicker_1').timepicker();
        $('#timepicker_2').timepicker({
            minuteStep: 1,
            template: 'modal',
            showSeconds: true,
            showMeridian: false
        });
    }
});

/*----------------------------------------------------*/
/*  WYSIWYG Editor - CLEditor
/*  http://premiumsoftware.net/cleditor/
/*----------------------------------------------------*/
$(function () {
    if(jQuery().cleditor) {
        $(".cleditor").cleditor({width:"100%", height:"100%"});
    }
});

/*----------------------------------------------------*/
/*  Autosize Textarea
/*  http://www.jacklmoore.com/autosize/
/*----------------------------------------------------*/
$(function () {
    if(jQuery().autosize) {
        $('textarea.autosize').autosize();
    }
});

/*----------------------------------------------------*/
/*  Form Validation - bassistance
/*  http://bassistance.de/jquery-plugins/jquery-plugin-validation/
/*----------------------------------------------------*/
$(function () {
    if(jQuery().validate) {
        // Set Defaults
        jQuery.validator.setDefaults({
            errorElement: 'span',
            errorClass: 'help-block',
            highlight:function(element, errorClass, validClass) {
                $(element).parents('.control-group').addClass('error');
            },
            unhighlight: function(element, errorClass, validClass) {
                $(element).parents('.control-group').removeClass('error');
            }
        });
        $("#form_validate_inline").validate();
    }
});

/*----------------------------------------------------*/
/*  Form Validation - Validation Engine
/*  http://posabsolute.github.io/jQuery-Validation-Engine
/*----------------------------------------------------*/
$(function () {
    if(jQuery().validationEngine) {
        $("#form_validate_tooltip").validationEngine();
    }
});

/*----------------------------------------------------*/
/*  Bootstrap Daterange Picker
/*  https://github.com/dangrossman/bootstrap-daterangepicker
/*----------------------------------------------------*/
$(function(){
    if(jQuery().daterangepicker) {
        // Open Left
        $('.daterange.right').daterangepicker({
            opens: 'left'
        });

        // Open Right - default
        $('.daterange').daterangepicker();

        // Report range
        $('#reportrange').daterangepicker({
            ranges: {
                'Today': [moment(), moment()],
                'Yesterday': [moment().subtract('days', 1), moment().subtract('days', 1)],
                'Last 7 Days': [moment(), moment().add({ days: -6 })],
                'Last 30 Days': [moment().add({ days: -29 }), moment()],
            }
        },
        function(start, end) {
            $('#reportrange #rangedate').html(start.format('MMMM d, YYYY') + ' - ' + end.format('MMMM d, YYYY'));
        });
    }
});

/*----------------------------------------------------*/
/*  Jquery UI - Tabs
/*  http://jqueryui.com/tabs/
/*----------------------------------------------------*/
$(function() {
    if(jQuery().tabs) {
        $("#tabs1").tabs();
        $("#tabs2").tabs();
    }
});

/*----------------------------------------------------*/
/*  Jquery UI - Accordion
/*  http://jqueryui.com/accordion/
/*----------------------------------------------------*/
$(function() {
    if(jQuery().accordion) {
        $("#accordion_1, #accordion_2").accordion({
            heightStyle: "content"
        });
    }
});

/*----------------------------------------------------*/
/*  Jquery UI - Datepicker
/*  http://jqueryui.com/datepicker/
/*----------------------------------------------------*/
$(function() {
    if(jQuery().datepicker) {
        $("#datepicker1").datepicker();
        $("#datepicker2").datepicker({
            showButtonPanel: true
        });
        $("#datepicker3").datepicker({
            numberOfMonths: 3,
            showButtonPanel: true
        });
    }
});

/*----------------------------------------------------*/
/*  Jquery UI - Timepicker
/*  http://trentrichardson.com/examples/timepicker/
/*----------------------------------------------------*/
$(function() {
    if(jQuery().timepicker) {
        $("#timepicker1").timepicker();
        $("#timepicker2").timepicker({
            showSecond: true
        });
    }
});

/*----------------------------------------------------*/
/*  Jquery UI - Slider
/*  http://jqueryui.com/slider/
/*----------------------------------------------------*/
$(function() {
    if(jQuery().slider) {
        $("#slider1").slider({
            range: "min",
            value: 37,
            min: 1,
            max: 700,
            start: function( event, ui ) {
                $(this).find('.ui-slider-handle.ui-state-hover')
                .append('<span class="ui-slider-tooltip">'+ui.value+'</span>');
            },
            slide: function( event, ui ) {
                $(this).find('.ui-slider-tooltip').text(ui.value);
            },
            stop: function( event, ui ) {
                $(this).find('.ui-slider-tooltip').remove();
            }
        });
        $("#slider2").slider({
            range: true,
            min: 0,
            max: 500,
            values: [ 75, 300 ],
            start: function( event, ui ) {
                $(this).find('.ui-slider-handle.ui-state-hover')
                .append('<span class="ui-slider-tooltip">'+ui.value+'</span>');
            },
            slide: function( event, ui ) {
                $(this).find('.ui-slider-tooltip').text(ui.value);
            },
            stop: function( event, ui ) {
                $(this).find('.ui-slider-tooltip').remove();
            }
        });
        $("#slider3").slider({
            range: "max",
            min: 1,
            max: 10,
            value: 2,
            start: function( event, ui ) {
                $(this).find('.ui-slider-handle.ui-state-hover')
                .append('<span class="ui-slider-tooltip">'+ui.value+'</span>');
            },
            slide: function( event, ui ) {
                $(this).find('.ui-slider-tooltip').text(ui.value);
            },
            stop: function( event, ui ) {
                $(this).find('.ui-slider-tooltip').remove();
            }
        });
        $("#eq > span").each(function() {
            // read initial values from markup and remove that
            var value = parseInt( $(this).text(), 10);
            $( this ).empty().slider({
                value: value,
                range: "min",
                animate: true,
                orientation: "vertical"
            });
        });
    }
});

/*----------------------------------------------------*/
/*  Jquery UI - Autocomplete
/*  http://jqueryui.com/autocomplete/
/*----------------------------------------------------*/
$(function() {
    if(jQuery().autocomplete) {
        var availableTags = [
            "ActionScript",
            "AppleScript",
            "Asp",
            "BASIC",
            "C",
            "C++",
            "Clojure",
            "COBOL",
            "ColdFusion",
            "Erlang",
            "Fortran",
            "Groovy",
            "Haskell",
            "Java",
            "JavaScript",
            "Lisp",
            "Perl",
            "PHP",
            "Python",
            "Ruby",
            "Scala",
            "Scheme"
        ];
        $("#autocomplete").autocomplete({
            source: availableTags
        });
    }
});

/*----------------------------------------------------*/
/*  Jquery UI - Dialog
/*  http://jqueryui.com/dialog/
/*----------------------------------------------------*/
$(function() {
    if(jQuery().dialog) {
        $("#dialog1").dialog({
            autoOpen: false
        });
        $("#dialog2").dialog({
            autoOpen: false,
            modal: true
        });
        $("#dialog3").dialog({
            autoOpen: false,
            show: "blind",
            hide: "explode"
        });
        $('#btn-dialog').click(function() {
            $("#dialog1").dialog('open');
        });
        $('#btn-dialogmodal').click(function() {
            $("#dialog2").dialog('open');;
        });
        $('#btn-dialoganim').click(function() {
            $("#dialog3").dialog('open');
        });
    }
});

/*----------------------------------------------------*/
/*  Jquery UI - Sortable
/*  http://jqueryui.com/sortable/#portlets
/*----------------------------------------------------*/
$(function() {
    $( ".column" ).sortable({
        connectWith: ".column",
        placeholder: "widget-placeholder",
        handle: ".handle"
    });
});

/*----------------------------------------------------*/
/*  Gallery Shuffle
/*----------------------------------------------------*/
$(function(){
    if(jQuery().shuffle) {
        $('.portfolio-filter li').on('click', function(e) {
            var $this = $(this),
                $grid = $('.gallery');

            $grid.shuffle($this.data('group'));

            e.preventDefault();
        });
        $(window).load(function() {
            $('.gallery').shuffle();
        });
    }
});

/*----------------------------------------------------*/
/*  Prettyphoto
/*  http://www.no-margin-for-errors.com/projects/prettyphoto-jquery-lightbox-clone/
/*----------------------------------------------------*/
$(function(){
    if(jQuery().prettyPhoto) {
        $("a[rel^='prettyPhoto']").prettyPhoto({
            allow_resize: true,
            social_tools: false
        });
    }
});

/*----------------------------------------------------*/
/*  Datatables & Table
/*  http://www.datatables.net/
/*----------------------------------------------------*/
$(function () {
    if(jQuery().dataTable) {
        $('#datatable1').dataTable({
            "bProcessing": true,
            "sAjaxSource": 'table-dynamic.txt',
            "aoColumns": [
                null,
                null,
                null,
                null,
                null
            ],
            "fnRowCallback": function( nRow, aData, iDisplayIndex, iDisplayIndexFull ) {
                $('td:eq(1)', nRow).addClass('hidden-phone');
                $('td:eq(3)', nRow).addClass('hidden-phone');
                $('td:eq(4)', nRow).addClass('hidden-phone');
            }
        });

        var $table = $('#datatable2').dataTable({
            "bProcessing": true,
            "sAjaxSource": 'table-dynamic-rich.txt',
            "aoColumns": [
                { "bSortable": false },
                null,
                null,
                null,
                null,
                { "bSortable": false }
            ],
            "fnRowCallback": function( nRow, aData, iDisplayIndex, iDisplayIndexFull ) {
                $('td:eq(2)', nRow).addClass('hidden-phone');
                $('td:eq(3)', nRow).addClass('hidden-phone');
                $('td:eq(4)', nRow).addClass('hidden-phone');

                // Apply iCheck to checkbox
                $('td input[type="checkbox"]', nRow).iCheck({
                    checkboxClass: 'icheckbox_minimal-grey',
                    radioClass: 'iradio_minimal-grey',
                    increaseArea: '20%' // optional
                });
            }
        });

        // Datatable Checkbox check all
        $('thead input[type="checkbox"]').on('ifChecked', function (e){
            $('tbody input[type="checkbox"]').each( function (e) {
                $(this).iCheck('check');
            });
        });
        // Datatable Checkbox uncheck all
        $('thead input[type="checkbox"]').on('ifUnchecked', function (e){
            $('tbody input[type="checkbox"]').each( function (e) {
                $(this).iCheck('uncheck');
            });
        });
    }
});

/*----------------------------------------------------*/
/*  Gritter - Growl notification
/*  http://boedesign.com/blog/2009/07/11/growl-for-jquery-gritter/
/*----------------------------------------------------*/
$(function () {
    if($('.gritter-data').length > 0) {
        $('.gritter-data').each(function () {
            var $title = $(this).children('.title').text();
            var $text = $(this).children('.text').text();
            var $image = $(this).children('.image').text();
            var $color = 'gritter-'+$(this).data('color');
            var $time = $(this).data('time');

            $.gritter.add({
                title: $title,
                text: $text,
                image: $image,
                time: $time,
                class_name: $color
            });
        });
    }
});
RawBlameHistory     893 lines (750 sloc)  25.1 KB
var app = angular.module("mineos", ['angularMoment', 'pascalprecht.translate', 'ngSanitize']);

app.config(function ($translateProvider) {
  $translateProvider.useSanitizeValueStrategy('escape');
  $translateProvider.useStaticFilesLoader({
    prefix: 'locales/locale-',
    suffix: '.json'
  });
  $translateProvider.preferredLanguage('en_US');
});

/* directives */

app.directive('ngEnter', function () {
  //http://eric.sau.pe/angularjs-detect-enter-key-ngenter/
  return function (scope, element, attrs) {
    element.bind("keydown keypress", function (event) {
      if(event.which === 13) {
        scope.$apply(function (){
          scope.$eval(attrs.ngEnter);
        });

        event.preventDefault();
      }
    });
  };
});

app.directive('stickyConsole', function () {
  return function (scope, element, attrs) {

    var elem = angular.element(element)[0];
    var follow = true;

    // Setup binds to element
    element.bind('scroll', function () {
      // Start following if scroll bar is within 2px of
      // the bottom
      if(elem.scrollHeight - elem.scrollTop > elem.offsetHeight) {
        follow = false;
      } else {
        follow = true;
      }
    });

    // This event gets fired off constantly to check for updates.  I am
    // using it to keep tabs on when the console should scroll down.
    scope.$watch(function(){
      if(follow) {
        elem.scrollTop = elem.scrollHeight;
      }
    });
  };
});

/* filters */

app.filter('membership', function() {
  return function(servers) {
    var keep = {};

    for (var s in servers)
      if (servers[s].sp)
        keep[s] = servers[s];

    return keep;
  }
})

app.filter('bytes_to_mb', function() {
  return function(bytes) {
    if (bytes == 0)
      return '0B';
    else if (bytes < 1024)
      return bytes + 'B';

    var k = 1024;
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    var i = Math.floor(Math.log(bytes) / Math.log(k));

    return (bytes / Math.pow(k, i)).toPrecision(3) + sizes[i];
  };
})

app.filter('kb_string_to_mb', function() {
  return function(kbyte_str) {
    var k = 1024;
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    var kbytes = parseInt(kbyte_str) * k;

    if (kbytes) {
      var i = Math.floor(Math.log(kbytes) / Math.log(k));
      return (kbytes / Math.pow(k, i)).toPrecision(3) + sizes[i];
    } else {
      return '';
    }
  };
})

app.filter('seconds_to_time', function() {
  return function(seconds) {
    return moment.duration(seconds, "seconds").format();
  }
})

app.filter('time_from_now', function() {
  return function(seconds) {
    return moment(seconds).fromNow();
  }
})

app.filter('profile_filter', function() {
  return function(profiles, criteria) {
    var keep = [];

    if (criteria.value == 'all')
      return profiles;
    else {
      for (var index in profiles)
        if (criteria.value == profiles[index][criteria.field])
          keep.push(profiles[index]);

      return keep;
    }
  }
})

app.filter('profile_downloaded', function() {
  return function(profiles, criteria) {
    var keep = [];

    if (criteria == 'all')
      return profiles;
    else {
      for (var index in profiles)
        if (criteria == 'only_downloaded' && profiles[index].downloaded)
          keep.push(profiles[index]);

      return keep;
    }
  }
})

app.filter('remove_old_versions', function() {
  return function(profiles, remove_older_than) {
    var keep = [];

    for (var index in profiles)
      if (parseFloat(profiles[index].version) >= parseFloat(remove_older_than))
          keep.push(profiles[index]);

    return keep;
  }
})

app.filter('colorize', [ '$sce', function($sce){

  const ANSI_MIN_COLOR    = 30,
        ANSI_MAX_COLOR    = 37,
        ANSI_COLOR_OFFSET = 30,
        ANSI_INTENSE_CODE = 1,
        ANSI_NORMAL_CODE  = 22;

  var Colors = [ 
    'black',        // 30
    'dark_red',     // 31
    'dark_green',   // 32
    'gold',         // 33
    'dark_blue',    // 34
    'dark_purple',  // 35
    'dark_aqua',    // 36
    'gray'          // 37
  ];

  var IntenseColors = [
    'dark_gray',    // 30 with 1
    'red',          // 31 with 1
    'green',        // 32 with 1
    'yellow',       // 33 with 1
    'blue',         // 34 with 1
    'light_purple', // 35 with 1
    'aqua',         // 36 with 1
    'white',        // 37 with 1
  ];


  function escapeChars(str){
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;")
  }

  return function(str) {
    /* Regex Explanation from regex101.com
      + /\[0;((?:\d+;?)+)m|\[m/g
        + 1st Alternative: \[0;((?:\d+;?)+)m
          + \[ matches the character [ literally
          + 0; matches the characters 0; literally
          + 1st Capturing group ((?:\d+;?)+)
            + (?:\d+;?)+ Non-capturing group
                + Quantifier: + Between one and unlimited times, as many times as possible, giving back as needed [greedy]
              + \d+ match a digit [0-9]
                + Quantifier: + Between one and unlimited times, as many times as possible, giving back as needed [greedy]
              + ;? matches the character ; literally
                + Quantifier: ? Between zero and one time, as many times as possible, giving back as needed [greedy]
            + m matches the character m literally (case sensitive)
        + 2nd Alternative: \[m
          + \[ matches the character [ literally
          + m matches the character m literally (case sensitive)
      + g modifier: global. All matches (don't return on first match)
        Note: "(" and ")" are needed for split otherwise matched content is ignored.
    */
    var splitString = str.split(/\[0;((?:\d+;?)+)m|\[m/g);

    var spanOpen = false;
    for ( i  in splitString ) {

      // Every over cell should be format codes
      if ( i % 2 == 1 ) {

        // Check for closing span at end of array (there WILL be an undefined element)
        if (splitString[i] == undefined)
          splitString[i] = spanOpen ? '</span>' : '';
        else {
          // Setup new formatting span.  formatCodes
          // are split first so we can reuse the array cell
          // as a work area.
          var formatCodes = splitString[i].split(';');
          splitString[i] = spanOpen ? '</span>' : '';
          splitString[i] += '<span class="';

          // Parse the ANSI format codes and extract useable
          // information into variables.
          var intense;
          var colorCode;
          for (j in formatCodes) {
            formatCode = parseInt(formatCodes[j]);

            if (formatCode == ANSI_INTENSE_CODE)
              intense = true;
            else if (formatCode == ANSI_NORMAL_CODE) 
              intense = false;
            else if (formatCode >= ANSI_MIN_COLOR && formatCode <= ANSI_MAX_COLOR)
              colorCode = formatCode;
            else 
              console.log('Unsupported format code: ' + formatCode);
          }

          // Add color class to span
          if (intense)
            splitString[i] += IntenseColors[colorCode - ANSI_COLOR_OFFSET];
          else
            splitString[i] += Colors[colorCode - ANSI_COLOR_OFFSET];

          // Close span off
          splitString[i] += '">';
          spanOpen = true;
        }
      } else 
        splitString[i] = escapeChars(splitString[i]);
    }

    // needed so the color spans will be used as HTML and not as text
    return $sce.trustAsHtml(splitString.join(''));
  }
}]);

/* controllers */

app.controller("Webui", ['$scope', 'socket', 'Servers', '$filter', '$translate', function($scope, socket, Servers, $filter, $translate) {
  $scope.page = 'dashboard';
  $scope.servers = Servers;
  $scope.current = null;
  $scope.build_jar_log = [];

  $scope.serverprofiles = {
    group: 'mojang',
    type: 'release',
    downloaded: 'all'
  }

  /* watches */
  $scope.$watch(function(scope) { return scope.page },
    function(new_value, previous_value) {
      socket.emit(new_value, 'page_data', new_value);
    }
  );

  $scope.$watch(function(scope) { return scope.preferred_locale },
    function(new_value, previous_value) {
      $scope.change_locale(new_value);
    }
  );

  $scope.$watch(function(scope) { return scope.current },
    function() {
      $scope.refresh_checkboxes();

      if (!($scope.current in Servers))
        $scope.change_page('dashboard');
    }
  );

  /* computed variables */

  $scope.servers_up = function() {
    return $.map(Servers, function(instance, server_name) {
      return instance;
    }).filter(function(instance) {
      return ('heartbeat' in instance ? instance.heartbeat.up : false);
    }).length;
  }

  $scope.players_online = function() {
    var online = 0;
    $.each(Servers, function(server_name, instance) {
      try {
        if (instance.heartbeat.ping.players_online)
          online += (instance.heartbeat.ping.players_online)
      } catch (e) {}
    })
    return online;
  }

  $scope.player_capacity = function() {
    var capacity = 0;
    $.each(Servers, function(server_name, instance) {
      if ('sp' in instance)
        capacity += instance.sp['max-players'];
    })
    return capacity;
  }

  /* socket handlers */

  socket.on('/', 'whoami', function(username) {
    $scope.username = username;
  })

  socket.on('/', 'commit_msg', function(commit_msg) {
    console.log(commit_msg)
    $scope.commit_msg = commit_msg;
    $scope.git_commit = commit_msg.split(' ')[0];
  })

  socket.on('/', 'host_heartbeat', function(data) {
    $scope.host_heartbeat = data;
    $scope.update_loadavg(data.loadavg);
  })

  socket.on('/', 'profile_list', function(profile_data) {
    $scope.profiles = profile_data;

    for (var p in profile_data)
      if (profile_data[p].id == 'BuildTools-latest')
        $scope.buildtools_jar = profile_data[p];
  })

  socket.on('/', 'user_list', function(user_data) {
    $scope.users = user_data;
  })

  socket.on('/', 'group_list', function(group_data) {
    $scope.groups = group_data;
  })

  socket.on('/', 'archive_list', function(archive_data) {
    $scope.archive_list = archive_data;
  })

  socket.on('/', 'spigot_list', function(spigot_list) {
    $scope.spigot_list = spigot_list;
  })

  socket.on('/', 'build_jar_output', function(data) {
    while ($scope.build_jar_log.length > 25)
      $scope.build_jar_log.splice(0,1);
    $scope.build_jar_log.push(data);
  })

  socket.on('/', 'host_notice', function(data) {
    var suppress = false;
    if ('suppress_popup' in data || data.success)
      suppress = true;

    $.gritter.add({
      title: "{0} {1}".format(data.command,
                              (data.success ? $filter('translate')('SUCCEEDED') : $filter('translate')('FAILED')) ),
      text: data.help_text
    });
  })

  socket.on('/', 'file_progress', function(data) {
    for (var p in $scope.profiles)
      if (data.group == $scope.profiles[p].group &&
          data.id == $scope.profiles[p].id &&
          data.type == $scope.profiles[p].type)
        $scope.profiles[p].progress = data.progress;
  })

  $scope.loadavg = [];
  $scope.loadavg_options = {
      element: $("#load_averages"),
      fallback_xaxis_max: 1,
      series: { 
        lines: {
          show: true,
          fill: .5
        },
        shadowSize: 0 
      },
      yaxis: { min: 0, max: 1 },
      xaxis: { min: 0, max: 30, show: false },
      grid: { borderWidth: 0 }
    };

  /* other functions */
  
  $scope.change_locale = function(locale) {
    $translate.use(locale);
  }

  $scope.server_command = function(cmd, args) {
    if (args) {
      args.command = cmd;
      socket.emit($scope.current, 'command', args);
    } else
      socket.emit($scope.current, 'command', {command: cmd});
  }

  $scope.host_command = function(cmd, args) {
    if (args) {
      args.command = cmd;
      socket.emit('/', 'command', args);
    } else
      socket.emit('/', 'command', {command: cmd});
  }

  $scope.cron_command = function(cmd, args) {
    args['operation'] = cmd;
    socket.emit($scope.current, 'cron', args);
  }

  $scope.player_command = function(cmd, player, args) {
    var full_cmd = '{0} {1} {2}'.format(cmd, player, args || '');
    socket.emit($scope.current, 'command', {command: 'stuff', msg: full_cmd });
  }

  $scope.console_input = function() {
    socket.emit($scope.current, 'command', {command: 'stuff', msg: $scope.user_input });
    $scope.user_input = '';
  }

  $scope.change_sc = function(section, property, new_value) {
    if (!new_value)
      new_value = '';
    socket.emit($scope.current, 'command', { command: 'modify_sc',
                                             section: section, 
                                             property: property,
                                             new_value: new_value });
  }

  $scope.change_sp = function() {
    socket.emit($scope.current, 'command', { command: 'modify_sp', 
                                             property: this.property,
                                             new_value: this.new_value });
  }

  $scope.change_owner = function() {
    socket.emit($scope.current, 'command', { command: 'chown', 
                                             uid: parseInt($scope.servers[$scope.current].page_data.glance.owner.uid),
                                             gid: parseInt($scope.servers[$scope.current].page_data.glance.owner.gid)});
  }

  $scope.create_server = function() {
    var regex_valid_server_name = /^(?!\.)[a-zA-Z0-9_\.]+$/;

    var serverform = $scope.serverform;
    var server_name = serverform['server_name'];
    var hyphenated = {};

    if (!regex_valid_server_name.test(server_name)) {
      $.gritter.add({
        title: "Invalid server name",
        text: "Alphanumerics and underscores only (no spaces)."
      })
    } else {
      // if server name is valid, continue here
      if ($scope.unconventional) {
        socket.emit('/', 'command', {
          'command': 'create_unconventional_server',
          'server_name': server_name,
          'properties': hyphenated
        });
      } else {
        delete serverform['server_name'];

        for (var prop in serverform) 
          if (serverform.hasOwnProperty(prop)) 
            hyphenated[prop.split("_").join("-")] = serverform[prop]; //replace _ with -

        socket.emit('/', 'command', {
          'command': 'create',
          'server_name': server_name,
          'properties': hyphenated
        });
      }
      $scope.change_page('dashboard', server_name);
    }
  }

  $scope.modals = {
    open_new_server: function() {
      $('#modal_new_server').modal('show');
    },
    close_new_server_start: function() {
      $('#modal_new_server').modal('hide');
      socket.emit($scope.current, 'command', { 'command': 'start' });
    },
    open_accept_eula: function() {
      $('#modal_eula').modal('show');
    },
    close_accept_eula_start: function() {
      $('#modal_eula').modal('hide');
      socket.emit($scope.current, 'command', { 'command': 'start' });
    },
    close_accept_eula_restart: function() {
      $('#modal_eula').modal('hide');
      socket.emit($scope.current, 'command', { 'command': 'restart' });
    },
    open_add_sp: function() {
      $('#modal_sp').modal('show');
    },
    close_add_sp: function() {
      $('#modal_sp').modal('hide');
      socket.emit($scope.current, 'command', {
        'command': 'modify_sp',
        'property': $scope.sp.new_attribute,
        'new_value': $scope.sp.new_value
      });
    },
    open_locales: function() {
      $('#modal_locales').modal('show');
    },
    open_copy_to_server: function(jarversion) {
      $('#modal_spigotjar').modal('show');
      $scope.jarcopy_version = jarversion;
    },
    close_copy_to_server: function(jarversion) {
      $('#modal_spigotjar').modal('hide');
      socket.emit('/', 'command', {
        'command': 'copy_to_server',
        'server_name': $scope.server_target,
        'version': $scope.jarcopy_version
      });
    }
  }

  $scope.server_from_archive = function(archive_filename, awd_dir) {
    $scope.archive_filename = archive_filename;
    $scope.awd_dir = awd_dir;
    $('#modal_server_from_archive').modal('show');
  }

  $scope.server_from_archive_create = function() {
    var obj = {
      'command': 'create_from_archive',
      'new_server_name': $scope.new_server_name,
      'filename': $scope.archive_filename
    }

    if ($scope.awd_dir && $scope.current)
      obj['awd_dir'] = $scope.current;
    else
      obj['awd_dir'] = null;

    socket.emit('/', 'command', obj);
    $('#modal_server_from_archive').modal('hide');
    $scope.change_page('dashboard', $scope.new_server_name);
  }

  $scope.update_loadavg = function(new_datapoint) {
    $scope.loadavg.push(new_datapoint);

    while ($scope.loadavg.length > $scope.loadavg_options.xaxis.max)
      $scope.loadavg.splice(0,1);

    function get_enumerated_values(column) {
      var res = [];
      for (var i = 0; i < $scope.loadavg.length; ++i)
        res.push([i, $scope.loadavg[i][column]])
      return res;
    }

    function get_max_y(arr) {
      var max_y = 1;
      for (var i=0; i<arr.length; i++)
        if (arr[i][1] > max_y)
          max_y = arr[i][1];
      return max_y;
    }

    var dataset = [
      { label: "fifteen", data: get_enumerated_values(2), color: "#0077FF" },
      { label: "five", data: get_enumerated_values(1), color: "#ED7B00" },
      { label: "one", data: get_enumerated_values(0), color: "#E8E800" }
    ];

    $scope.loadavg_options.yaxis.max = Math.max.apply(Math, [
      get_max_y(dataset[0].data),
      get_max_y(dataset[1].data),
      get_max_y(dataset[2].data)
    ]);

    $.plot($scope.loadavg_options.element, dataset, $scope.loadavg_options).draw();
  }

  $scope.refresh_calendar = function() {
    var events = [];
    for (var server_name in Servers) {
      try { //archives
        Servers[server_name].page_data.glance.archives.forEach(function(value, idx) {
          events.push({
            title: '{0} archive'.format(server_name),
            start: value.time,
            allDay : false
          })
        })
      } catch (e) {}

      try { //backups
        Servers[server_name].page_data.glance.increments.forEach(function(value, idx) {
          events.push({
            title: '{0} backup'.format(server_name),
            start: value.time,
            allDay : false
          })
        })
      } catch (e) {}
    }
    $('#calendar').fullCalendar('destroy').fullCalendar({events: events });
  }

  $scope.refresh_checkboxes = function() {
    try {
      var sc = $scope.servers[$scope.current].sc;
      $scope.broadcast_to_lan = (sc.minecraft || {}).broadcast;
      $scope.onrebootstart = (sc.onreboot || {}).start;
      $scope.unconventional_server = (sc.minecraft || {}).unconventional;
    } catch (e) {
      $scope.broadcast_to_lan = false;
      $scope.onrebootstart = false;
      $scope.unconventional_server = false;
    }
      
    $('#broadcast').prop('checked', $scope.broadcast_to_lan );
    $('#onrebootstart').prop('checked', $scope.onrebootstart );
    $('#unconventional').prop('checked', $scope.unconventional_server );

    $scope.delete_archive = false;
    $scope.delete_backup = false;
    $scope.delete_servers = false;
  }

  $scope.change_page = function(page, server_name) {
    if (server_name)
      $scope.current = server_name;

    switch(page) {
      case 'calendar':
        $scope.refresh_calendar();
        break;
      default:
        break;
    }

    $scope.page = page;
  }
}]);

app.controller("Toolbar", ['$scope', 'Servers', function($scope, Servers) {
  $scope.servers = Servers;

  $scope.all_notices = function() {
    var all = [];
    for (var server_name in Servers) {
      for (var uuid in Servers[server_name].notices) {
        var new_obj = Servers[server_name].notices[uuid];
        new_obj.server_name = server_name;
        all.push(new_obj);
      }
    }
    return all;
  }
}])

/* factories */

app.factory("Servers", ['socket', '$filter', function(socket, $filter) {
  var self = this;

  var server_model = function(server_name) {
    var me = this;
    me.server_name = server_name;
    me.channel = socket;
    me.page_data = {};
    me.live_logs = {};
    me.notices = {};
    me.latest_notice = {};

    me.channel.on(server_name, 'heartbeat', function(data) {
      var previous_state = me.heartbeat;
      me.heartbeat = data.payload;

      if ((previous_state || {}).up == true && me.heartbeat.up == false) {
        me.channel.emit(server_name, 'page_data', 'glance');
        $.gritter.add({
          title: "[{0}] {1}".format(me.server_name, $filter('translate')('DOWN') ),
          text: ''
        });
      }
    })

    me.channel.on(server_name, 'page_data', function(data) {
      me.page_data[data.page] = data.payload;
    })

    me.channel.on(server_name, 'tail_data', function(data) {
      try {
        me.live_logs[data.filepath].push(data.payload);
      } catch (e) {
        me.live_logs[data.filepath] = [data.payload];
      }
    })

    me.channel.on(server_name, 'notices', function(data) {
      data.forEach(function(notice, index) {
        me.notices[notice.uuid] = notice;
      })
    })

    me.channel.on(server_name, 'file head', function(data) {
      me.live_logs[data.filename] = data.payload.split('\n');
    })

    me.channel.on(server_name, 'server_ack', function(data) {
      me.notices[data.uuid] = data;
    })

    me.channel.on(server_name, 'server-icon.png', function(data) {
      me['icon'] = data;
    })

    me.channel.on(server_name, 'server.properties', function(data) {
      me['sp'] = data;
    })

    me.channel.on(server_name, 'server.config', function(data) {
      me['sc'] = data;
    })

    me.channel.on(server_name, 'config.yml', function(data) {
      me['cy'] = data;
    })

    me.channel.on(server_name, 'cron.config', function(data) {
      me['cc'] = data;
    })

    me.channel.on(server_name, 'server_fin', function(data) {
      me.notices[data.uuid] = data;
      me.latest_notice[data.command] = data;
      me.channel.emit(server_name, 'page_data', 'glance');

      var suppress = false;
      if ('suppress_popup' in data || data.success)
        suppress = true;

      if (data.err == 'eula') 
        $('#modal_eula').modal('show');

      if (!suppress) {
        var help_text = '';
        try {
          help_text = $filter('translate')(data.err);
        } catch (e) {}

        $.gritter.add({
          title: "[{0}] {1} {2}".format(me.server_name, data.command,
                                        (data.success ? $filter('translate')('SUCCEEDED') : $filter('translate')('FAILED')) ),
          text: help_text || ''
        });
      }
    })

    me.channel.on(server_name, 'eula', function(accepted) {
      me.page_data.glance.eula = accepted;
      if (accepted == false)
        $('#modal_eula').modal('show');
    })

    me.channel.emit(server_name, 'server-icon.png');
    me.channel.emit(server_name, 'page_data', 'glance');
    me.channel.emit(server_name, 'get_file_contents', 'proxy.log.0');
    me.channel.emit(server_name, 'get_file_contents', 'logs/latest.log');
    me.channel.emit(server_name, 'get_file_contents', 'server.log');
    me.channel.emit(server_name, 'req_server_activity');
    me.channel.emit(server_name, 'config.yml');
    me.channel.emit(server_name, 'cron.config');
    me.channel.emit(server_name, 'server.config');
    me.channel.emit(server_name, 'server.properties');

    return me;
  }

  socket.on('/', 'track_server', function(server_name) {
    self[server_name] = new server_model(server_name);
  })

  socket.on('/', 'untrack_server', function(server_name) {
    delete self[server_name];
  })

  return self;
}])

app.factory('socket', function ($rootScope) {
  //http://briantford.com/blog/angular-socket-io
  var sockets = {};

  var port = window.location.port || null;
  if (port === null) {
    //this path should pretty much never occur
    //but permits users to not have to use default port assignment
    //i.e., any user-specified port will be honored.
    if (window.location.protocol == "https:")
      var port = '443';
    else
      var port = '80';
  }

  var connect_string = ':{0}/'.format(port);

  return {
    on: function (server_name, eventName, callback) {
      if (!(server_name in sockets)) {
        if (server_name == '/')
          sockets[server_name] = io(connect_string, {secure: true});
        else
          sockets[server_name] = io(connect_string + server_name, {secure: true});
      }

      sockets[server_name].on(eventName, function () {  
        var args = arguments;
        $rootScope.$apply(function () {
          callback.apply(sockets[server_name], args);
        });
      });
    },
    emit: function (server_name, eventName, data, callback) {
      if (!(server_name in sockets)) {
        if (server_name == '/')
          sockets[server_name] = io(connect_string, {secure: true});
        else
          sockets[server_name] = io(connect_string + server_name, {secure: true});
      }

      sockets[server_name].emit(eventName, data, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          if (callback) {
            callback.apply(sockets[server_name], args);
          }
        });
      })
    }
  };
})

/* prototypes */

String.prototype.format = String.prototype.f = function() {
  var s = this,
      i = arguments.length;

  while (i--) { s = s.replace(new RegExp('\\{' + i + '\\}', 'gm'), arguments[i]);}
  return s;
};
