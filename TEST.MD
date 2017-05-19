
## 未编译的Scss样式
```css
* {
    margin: 0;
    padding: 0;
}

img {
    vertical-align: middle;
    border: none;
}

.itembox {
    min-height: 80px;
    padding: 8px 10px;
    border-bottom: 1px solid #dbdbdb;
    position: relative;
}
.list-item {
    display: flex;

    .list-item-content {
        flex: 1;
        margin-right: 10px;

        .l-title {
            line-height: 20px;
            margin-top: 8px;
            margin-bottom: 10px;
            position: relative;
            overflow: hidden;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            word-break: break-all;
            color: #000;
            font-size: 14px;
        }

        .l-msg {
            display: flex;
            
            >span {
                font-size: 13px;
                color: #888;
            }

            .time{
                margin-left: 10px;
                margin-right: 5px;
            }

            .howmuchsee {
                text-align: right;
                flex: 1;
            }
        }
    }

    .list-item-pic > img {
        width: 100px;
        height: 80px;
    }
}

```

## 编译之后的css代码
```css
* {
	margin: 0;
	padding: 0;
}

img {
	vertical-align: middle;
	border: none;
}

.itembox {
	min-height: 80px;
	padding: 8px 10px;
	border-bottom: 1px solid #dbdbdb;
	position: relative;
}

.list-item {
	display: -webkit-box;
	display: -webkit-flex;
	display: -ms-flexbox;
	display: flex;
}

.list-item .list-item-content {
	-webkit-box-flex: 1;
	-webkit-flex: 1;
	-ms-flex: 1;
	flex: 1;
	margin-right: 10px;
}

.list-item .list-item-content .l-title {
	line-height: 20px;
	margin-top: 8px;
	margin-bottom: 10px;
	position: relative;
	overflow: hidden;
	display: -webkit-box;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
	word-break: break-all;
	color: #000;
	font-size: 14px;
}

.list-item .list-item-content .l-msg {
	display: -webkit-box;
	display: -webkit-flex;
	display: -ms-flexbox;
	display: flex;
}

.list-item .list-item-content .l-msg > span {
	font-size: 13px;
	color: #888;
}

.list-item .list-item-content .l-msg .time {
	margin-left: 10px;
	margin-right: 5px;
}

.list-item .list-item-content .l-msg .howmuchsee {
	text-align: right;
	-webkit-box-flex: 1;
	-webkit-flex: 1;
	-ms-flex: 1;
	flex: 1;
}

.list-item .list-item-pic > img {
	width: 100px;
	height: 80px;
}

```

## html代码结构

```html
<section class="itembox">
    <div class='list-item'>
        <div class="list-item-content">
            <p class="l-title">Why You Can’t Let Young QBs Learn from the Bench Learn from the Bench</p>
            <div class="l-msg">
                <span class="source">mmqbm</span>
                <span class="time">1 min ago</span>
                <span class='howmuchsee'>123</span>
            </div>
        </div>
        
        <div class="list-item-pic">
            <img src="http://tcl-tstream.tclclouds.com/thumbnail/2017/5/17/00e2ca39a58c484cba129087652848b2.jpeg" lazy="loaded" />
        </div>
    </div>
</section>
```