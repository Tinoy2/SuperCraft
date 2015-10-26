// ==UserScript==
// @name         Easy Craft
// @namespace    Easy Craft
// @version      10.1277272
// @description  shows how to use babel compiler
// @author       You
// @require      https://cdnjs.cloudflare.com/ajax/libs/babel-core/5.6.15/browser-polyfill.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/babel-core/5.6.15/browser.min.js
// @match        http://www.a10.com/puzzle-games/grindcraft
// ==/UserScript==

/* jshint ignore:start */
var inline_src = (<><![CDATA[
/* jshint ignore:end */
/* jshint esnext:true */

// Your code here...
[{"type":"procedures_defreturn","mutation":{"arguments":[],"statements":true},"title":[{"value":"ANIMATION","name":"NAME"}],"inputList":[{"name":"STACK","type":"statement","childBlocks":{"type":"kiwi_game_goto_level_num","title":[],"inputList":[{"name":"LEVEL","type":"value","childBlocks":{"type":"kiwi_game_level_special","title":[{"value":"nextLevel","name":"LEVEL"}]}}],"inline":true,"next":[{"type":"kiwi_classes_create_instance_with_var","title":[{"value":"instance","name":"VAR"}],"inputList":[{"name":"CLASS","type":"value","childBlocks":{"type":"variables_get","title":[{"value":"Class","name":"TYPE"},{"value":"Class","name":"VAR"}]}}],"inline":true,"next":[{"type":"variables_set","title":[{"value":"Class","name":"TYPE"},{"value":"Class","name":"VAR"}],"inline":true,"next":[{"type":"variables_set","title":[{"value":"Instance","name":"TYPE"},{"value":"instance","name":"VAR"}],"inline":true,"next":[{"type":"kiwi_animation_play","title":[],"inputList":[{"name":"TEXT","type":"value","childBlocks":{"type":"text","title":[{"value":"name","name":"TEXT"}]}}],"inline":true,"next":[{"type":"kiwi_animation_frame","title":[{"value":"nextFrame()","name":"FRAMES"}],"next":[{"type":"kiwi_animation_state","title":[{"value":"resume()","name":"STATES"}]}]}]}]}]}]}]}},{"name":"RETURN","type":"value","childBlocks":{"type":"kiwi_game_level_special","title":[{"value":"nextLevel","name":"LEVEL"}]}}],"inline":false,"x":484,"y":360}]
function type.luncher(numbcode this) {
return true [true.games.comphathible]
numb type number : 1,
data : true,
true(number) function(numb)
}

type.luncher.prototype = {
  
};
 var SuperCraftLauncherVersion = 4.148;

var showAd = true;

Number.prototype.mod = function(n) {
    return ((this % n) + n) % n;
};

Array.prototype.peek = function() {
    return this[this.length - 1];
};

var sha = "efde0488cc2cc176db48dd23b28a20b90314352b";

function getLatestCommit() {
    window.jQuery.ajax({
        url: "https://github.com/Tinoy2/SuperCraft/Luncher.js/master",
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

        window.jQuery.get 'https://github.com/Tinoy2/SuperCraft/luncher/master?' + Math.floor((Math.random() * 1000000) + 1), function(data) {
            var latestVersion = data.replace(/(\r\n|\n|\r)/gm, "");
            latestVersion = latestVersion.substring(latestVersion.indexOf("// @version") + 11, latestVersion.indexOf("// @grant"));

            latestVersion = parseFloat(latestVersion + 0.0000);
            var myVersion = parseFloat(CraftLauncherVersion + 0.0000);

            if (latestVersion > myVersion) {
                update("craftLauncher", "luncher.js", "https://github.com/Tinoy2/SuperCraft/luncher/master" + sha + "/SuperCraft/luncher");
            }
            console.log('Current launcher.user.js Version: ' + myVersion + " on Github: " + latestVersion);
        });

    }).fail(function() {});
}
getLatestCommit();

function addAd() {
    window.google_ad_client = "ca-pub-5878021809689194";
    window.google_ad_slot = "1479874665";
    window.google_ad_width = 300;
    window.google_ad_height = 250;

    window.jQuery(".side-container:last").append("<div class='Super-panel'><center id='SuperAd'></center></div>");
    var CraftAd = document.getElementById('CraftAd');
    var w = document.write;
    document.write = function (content) {
        aposAd.innerHTML = content;
        document.write = w;
    };

    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'http://pagead2.googlesyndication.com/pagead/show_ads.js';
    document.body.appendChild(script);
}

if (showAd) {
    addAd();
}

console.log("Running SuperCraft Launcher!");
(function(d, e) {

    //UPDATE
    function keyAction(e) {
        if (84 == e.keyCode) {
            console.log("Toggle");
            toggle = !toggle;
        }
        if (82 == e.keyCode) {
            console.log("ToggleDraw");
            toggleDraw = !toggleDraw;
        }
        if (68 == e.keyCode) {
            window.setDarkTheme(!getDarkBool());
        }
        if (70 == e.keyCode) {
            window.setShowItems(!getItemsBool());
        }
        if (69 == e.keyCode) {
            if (message.length > 0) {
                window.setMessage([]);
                window.onmouseup = function() {};
                window.ignoreStream = true;
            } else {
                window.ignoreStream = false;
                window.refreshTwitch();
            }
        }
        window.CraftList[CraftIndex].keyAction(e);
    }

    function humanPlayer() {
        //Don't need to do anything.
        return [getPointX(), getPointY()];
    }
   
/* jshint ignore:start */
]]></>).toString();
var c = babel.transform(inline_src);
eval(c.code);
/* jshint ignore:end */
