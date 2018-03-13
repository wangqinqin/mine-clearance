Array.prototype.indexOf = function (val) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] == val) return i;
    }
    return -1;
};

Array.prototype.remove = function (val) {
    var index = this.indexOf(val);
    if (index > -1) {
        this.splice(index, 1);
    }
};
function CreateSaolei(options) {
    this.obj = options.obj;
    this.colSize = options.colSize;
    this.rowSize = options.rowSize;
    this.leiNum = options.leiNum;
    this.arrayNum = [this.colSize][this.rowSize];
    this.rightArray = [];
    this.rightLeave = 0;
    this.leiRightArray = [];
    this._setArea();
}

CreateSaolei.prototype._setArea = function () {
    var domArray=[];
    for(var i =0; i<this.colSize*this.rowSize; i++){
        domArray[i] = '<div class="gezi"></div>'
    }
    this.obj.css({'width':20*this.colSize,'height':20*this.rowSize});
    this.obj.html(domArray);
    this._bindShowEvent();
};
CreateSaolei.prototype._bindShowEvent = function (){
    var obj = this.obj;
    var _that = this;
    var _theFirst = 0;
    var arrayNum = [];
    obj.bind("contextmenu", function(){
        return false;
    });
    obj.off('mousedown').on('mousedown','.gezi',function(e) {
        var _thisDom = $(this);
        //右键为3
        if (3 == e.which) {
            if(_thisDom.hasClass('maybeLei')){
                _thisDom.removeClass('maybeLei').addClass('question');
                _that.rightArray.remove(_thisDom.index())
            }else if(_thisDom.hasClass('question')){
                _thisDom.removeClass('question');
            }else if(!_thisDom.hasClass('open')){
                _thisDom.addClass('maybeLei');
                _that.rightArray.push(_thisDom.index())
            }else{
                return;
            }
            // if(_that.rightArray.length == _that.leiNum){
            //     if(_that.rightArray.every(function (item, index, array) {return _that.leiRightArray.indexOf(item) > -1})){
            //         alert('恭喜你！你成功了！');
            //     }
            // }
        } else if (1 == e.which) {
            if(_thisDom.hasClass('maybeLei') || _thisDom.hasClass('question') || _thisDom.hasClass('lei')){return;}
            var row = Math.floor(_thisDom.index()/_that.colSize);
            var col = _thisDom.index()%_that.colSize;
            if(_theFirst == 0){
                _that._setLei(row,col);
                arrayNum = _that.arrayNum;
                if(arrayNum[row][col] == 0){
                    _that._nothingShowMore(row,col);
                }
                _theFirst++;
            }else{
                if(!_thisDom.hasClass('open')){
                    if(arrayNum[row][col] == -1){return;}
                    if(arrayNum[row][col] == 'BOOM'){
                        _thisDom.addClass('lei');
                        alert("哎哟哟，踩到炸弹了！");
                    }else if(arrayNum[row][col] == 0){
                        _thisDom.addClass('open');
                        _that._nothingShowMore(row,col);
                    }else{
                        _thisDom.addClass('open').html(arrayNum[row][col]);
                        arrayNum[row][col] = -1;
                        ++_that.rightLeave;
                    }

                }
            }
            console.log(_that.rightLeave)
            if(_that.rightLeave == (_that.colSize*_that.rowSize - _that.leiNum)){
                alert('恭喜你！你成功了！');
            }
        }
    })
};
CreateSaolei.prototype._setLei = function (row,col) {
    var leiNum = this.leiNum;
    var dataArray=[];
    for(var i=0;i<this.rowSize;i++){
        dataArray[i]=new Array(this.colSize);
    }
    var LeiArray = JSON.parse(JSON.stringify(dataArray));

    var j = 0;
    while(j<leiNum){
        var rowIndex = Math.floor((Math.random()*this.rowSize-1)+1);
        var colIndex = Math.floor((Math.random()*this.colSize-1)+1);
        if(LeiArray[rowIndex][colIndex] != 'BOOM'){
            if( (rowIndex == row && colIndex == col) ||
                (row > 0 && col > 0 && rowIndex == row-1 && colIndex == col-1) ||
                (row > 0 && rowIndex == row-1 && colIndex == col) ||
                (row > 0 && col < this.colSize && rowIndex == row-1 && colIndex == col+1) ||
                (col > 0 && rowIndex == row && colIndex == col-1) ||
                (col < this.colSize && rowIndex == row && colIndex == col+1) ||
                (row < this.rowSize && col > 0 && rowIndex == row+1 && colIndex == col-1) ||
                (row < this.rowSize && rowIndex == row+1 && colIndex == col) ||
                (row < this.rowSize && col < this.colSize && rowIndex == row+1 && colIndex == col+1)){}else{
                LeiArray[rowIndex][colIndex] = 'BOOM';
                this.leiRightArray.push(rowIndex*this.colSize+colIndex);
                j++;
            }
        }
    }
    this._setNum(LeiArray)
};
CreateSaolei.prototype._setNum = function (array) {
    var setNumArray = JSON.parse(JSON.stringify(array));
    for(var i = 0; i< this.rowSize; i++){
        for(var j = 0; j < this.colSize; j++) {
            var num = 0;
            //左上
            if (j > 0 && i > 0) {
                if (setNumArray[i - 1][j - 1] == 'BOOM') num++;
            }
            //正上
            if (i > 0) {
                if (setNumArray[i - 1][j] == 'BOOM') num++;
            }
            //右上
            if (i > 0 && j < this.colSize - 1) {
                if (setNumArray[i - 1][j + 1] == 'BOOM') num++;
            }
            //左
            if (j > 0) {
                if (setNumArray[i][j - 1] == 'BOOM') num++;
            }
            //右
            if (j < this.colSize - 1) {
                if (setNumArray[i][j + 1] == 'BOOM') num++;
            }
            //左下
            if (j > 0 && i < this.rowSize - 1) {
                if (setNumArray[i + 1][j - 1] == 'BOOM') num++;
            }
            //正下
            if (i < this.rowSize - 1) {
                if (setNumArray[i + 1][j] == 'BOOM') num++;
            }
            //右下
            if (j < this.colSize - 1 && i < this.rowSize - 1) {
                if (setNumArray[i + 1][j + 1] == 'BOOM') num++;
            }
            if(setNumArray[i][j]!="BOOM"){
                setNumArray[i][j] = num;
            }
        }
    }
    this.arrayNum = setNumArray;
};


CreateSaolei.prototype._open = function (row,col){
    var _gezi = this.obj.find('.gezi');
    var _thisDom = $(_gezi[row*this.colSize+col]);
    var arrayNum = this.arrayNum;
    var _thisValue = arrayNum[row][col];
    if(_thisValue != -1) {
        if (_thisValue != 0 && _thisValue != 'BOOM') {
            if(!(_thisDom.hasClass('maybeLei') || _thisDom.hasClass('question') ||  _thisDom.hasClass('lei') )){
                _thisDom.addClass('open').html(_thisValue);
                ++this.rightLeave;
                arrayNum[row][col] = -1;
            }
        } else if (_thisValue == 0) {
            _thisDom.addClass('open');
            ++this.rightLeave;
            arrayNum[row][col] = -1;
            this._nothingShowMore(row,col)
        }
    }
};
CreateSaolei.prototype._nothingShowMore = function (row,col){
    this._open(row,col);
    //左上
    if (col > 0 && row> 0) {
        this._open(row-1,col-1);
    }
    //正上
    if (row> 0) {
        this._open(row-1,col);
    }
    //右上
    if (row> 0 && col < this.colSize - 1) {
        this._open(row-1,col+1);
    }
    //左
    if (col > 0) {
        this._open(row,col-1);
    }
    //右
    if (col < this.colSize - 1) {
        this._open(row,col+1);
    }
    //左下
    if (col > 0 && row< this.rowSize - 1) {
        this._open(row+1,col-1);
    }
    //正下
    if (row< this.rowSize - 1) {
        this._open(row+1,col);
    }
    //右下
    if (col < this.colSize - 1 && row< this.rowSize - 1) {
        this._open(row+1,col+1);
    }

};


var createSaolei = new CreateSaolei({
    obj: $('#saolei'),
    rowSize:10,
    colSize:10,
    leiNum:10
});
$(document).on("change",'select#changeSaoLei',function(){
    var value = $(this).val();
    createSaolei = null;
    if(value == 10){
        createSaolei = new CreateSaolei({
            obj: $('#saolei'),
            rowSize:10,
            colSize:10,
            leiNum:10
        });
    }else if(value == 40){
        createSaolei = new CreateSaolei({
            obj: $('#saolei'),
            rowSize:16,
            colSize:16,
            leiNum:40
        });
    }else if(value == 99){
        createSaolei = new CreateSaolei({
            obj: $('#saolei'),
            rowSize:16,
            colSize:30,
            leiNum:99
        });
    }
});










// <script>
//
// function inheritPrototype(sub,sup) {
//     var _prototype = new Object(sup.prototype);
//     _prototype.constructor = sub;
//     sub.prototype = _prototype;
// }
// function ModalCommon(options) {
//     var optionsD = {};
//     var that = this;
//     options = $.extend(true,optionsD,options);
//     this.obj = options.obj;
//     this.title = options.title;
//     this.renderModal();
//     this.obj.on('click','.close-modal',function () {
//         that.closeModal();
//     })
// }
// ModalCommon.prototype.renderModal = function() {
//     this.obj.append(this._getHtml());
//     this.renderTitle(this.title);
//     this.obj.hide();
//
// };
// ModalCommon.prototype._getHtml = function() {
//     return '<div style="height: 30px;text-align: center;border-bottom: solid 1px #ccc;background: #00b793" class="modal-header"></div>' +
//         '<span class="close-modal" style="float:right;display: inline-block;cursor: pointer;margin-top: -20px;">x</span>'+
//         '<div style="height: 250px;padding: 10px;" class="modal-body"></div> ' +
//         '<div style="height: 20px;line-height: 20px;" class="modal-footer"></div>';
// };
// ModalCommon.prototype.renderTitle = function() {
//     this.obj.find('.modal-header').html(this.title);
// };
// ModalCommon.prototype.closeModal = function () {this.obj.hide();};
// ModalCommon.prototype.showModal = function () {this.obj.show();};
//
//
//
//
//
//
//
//
//
// /*---------*/
// function ChangePhoneModal(options) {
//     console.log(options);
//     this.options = options;
//     ModalCommon.call(this, this.options);
// }
//
// inheritPrototype(ChangePhoneModal, ModalCommon);
//
// var changeModalContainer = new ChangePhoneModal({
//     obj: $('#changePhone'),
//     title: '修改手机'
// });
// function openChangeModal(){
//     changeModalContainer.showModal();
// }
// </script>











