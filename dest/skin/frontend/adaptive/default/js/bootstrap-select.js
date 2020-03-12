(function(b){'use strict';function c(t){var u=[{re:/[\xC0-\xC6]/g,ch:'A'},{re:/[\xE0-\xE6]/g,ch:'a'},{re:/[\xC8-\xCB]/g,ch:'E'},{re:/[\xE8-\xEB]/g,ch:'e'},{re:/[\xCC-\xCF]/g,ch:'I'},{re:/[\xEC-\xEF]/g,ch:'i'},{re:/[\xD2-\xD6]/g,ch:'O'},{re:/[\xF2-\xF6]/g,ch:'o'},{re:/[\xD9-\xDC]/g,ch:'U'},{re:/[\xF9-\xFC]/g,ch:'u'},{re:/[\xC7-\xE7]/g,ch:'c'},{re:/[\xD1]/g,ch:'N'},{re:/[\xF1]/g,ch:'n'}];return b.each(u,function(){t=t?t.replace(this.re,this.ch):''}),t}function f(t){var u=arguments,v=t;[].shift.apply(u);var w,x=this.each(function(){var y=b(this);if(y.is('select')){var z=y.data('selectpicker'),A='object'==typeof v&&v;if(!z){var B=b.extend({},q.DEFAULTS,b.fn.selectpicker.defaults||{},y.data(),A);B.template=b.extend({},q.DEFAULTS.template,b.fn.selectpicker.defaults?b.fn.selectpicker.defaults.template:{},y.data().template,A.template),y.data('selectpicker',z=new q(this,B))}else if(A)for(var C in A)A.hasOwnProperty(C)&&(z.options[C]=A[C]);'string'==typeof v&&(z[v]instanceof Function?w=z[v].apply(z,u):w=z.options[v])}});return'undefined'==typeof w?x:w}String.prototype.includes||function(){'use strict';var t={}.toString,u=function(){try{var x={},y=Object.defineProperty,z=y(x,x,x)&&y}catch(A){}return z}(),v=''.indexOf,w=function(x){if(null==this)throw new TypeError;var y=this+'';if(x&&'[object RegExp]'==t.call(x))throw new TypeError;var z=y.length,A=x+'',B=A.length,C=1<arguments.length?arguments[1]:void 0,D=C?+C:0;D!=D&&(D=0);var E=Math.min(Math.max(D,0),z);return!(B+E>z)&&-1!=v.call(y,A,D)};u?u(String.prototype,'includes',{value:w,configurable:!0,writable:!0}):String.prototype.includes=w}(),String.prototype.startsWith||function(){'use strict';var t=function(){try{var w={},x=Object.defineProperty,y=x(w,w,w)&&x}catch(z){}return y}(),u={}.toString,v=function(w){if(null==this)throw new TypeError;var x=this+'';if(w&&'[object RegExp]'==u.call(w))throw new TypeError;var y=x.length,z=w+'',A=z.length,B=1<arguments.length?arguments[1]:void 0,C=B?+B:0;C!=C&&(C=0);var D=Math.min(Math.max(C,0),y);if(A+D>y)return!1;for(var E=-1;++E<A;)if(x.charCodeAt(D+E)!=z.charCodeAt(E))return!1;return!0};t?t(String.prototype,'startsWith',{value:v,configurable:!0,writable:!0}):String.prototype.startsWith=v}(),Object.keys||(Object.keys=function(t,u,v){for(u in v=[],t)v.hasOwnProperty.call(t,u)&&v.push(u);return v});var g={useDefault:!1,_set:b.valHooks.select.set};b.valHooks.select.set=function(t,u){return u&&!g.useDefault&&b(t).data('selected',!0),g._set.apply(this,arguments)};var h=null;b.fn.triggerNative=function(t){var v,u=this[0];u.dispatchEvent?('function'==typeof Event?v=new Event(t,{bubbles:!0}):(v=document.createEvent('Event'),v.initEvent(t,!0,!1)),u.dispatchEvent(v)):u.fireEvent?(v=document.createEventObject(),v.eventType=t,u.fireEvent('on'+t,v)):this.trigger(t)},b.expr.pseudos.icontains=function(t,u,v){var w=b(t),x=(w.data('tokens')||w.text()).toString().toUpperCase();return x.includes(v[3].toUpperCase())},b.expr.pseudos.ibegins=function(t,u,v){var w=b(t),x=(w.data('tokens')||w.text()).toString().toUpperCase();return x.startsWith(v[3].toUpperCase())},b.expr.pseudos.aicontains=function(t,u,v){var w=b(t),x=(w.data('tokens')||w.data('normalizedText')||w.text()).toString().toUpperCase();return x.includes(v[3].toUpperCase())},b.expr.pseudos.aibegins=function(t,u,v){var w=b(t),x=(w.data('tokens')||w.data('normalizedText')||w.text()).toString().toUpperCase();return x.startsWith(v[3].toUpperCase())};var m=function(t){var u=function(y){return t[y]},v='(?:'+Object.keys(t).join('|')+')',w=RegExp(v),x=RegExp(v,'g');return function(y){return y=null==y?'':''+y,w.test(y)?y.replace(x,u):y}},n=m({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#x27;','`':'&#x60;'}),p=m({'&amp;':'&','&lt;':'<','&gt;':'>','&quot;':'"','&#x27;':'\'','&#x60;':'`'}),q=function(t,u){g.useDefault||(b.valHooks.select.set=g._set,g.useDefault=!0),this.$element=b(t),this.$newElement=null,this.$button=null,this.$menu=null,this.$lis=null,this.options=u,null===this.options.title&&(this.options.title=this.$element.attr('title'));var v=this.options.windowPadding;'number'==typeof v&&(this.options.windowPadding=[v,v,v,v]),this.val=q.prototype.val,this.render=q.prototype.render,this.refresh=q.prototype.refresh,this.setStyle=q.prototype.setStyle,this.selectAll=q.prototype.selectAll,this.deselectAll=q.prototype.deselectAll,this.destroy=q.prototype.destroy,this.remove=q.prototype.remove,this.show=q.prototype.show,this.hide=q.prototype.hide,this.init()};q.VERSION='1.12.2',q.DEFAULTS={noneSelectedText:'Nothing selected',noneResultsText:'No results matched {0}',countSelectedText:function(t){return 1==t?'{0} item selected':'{0} items selected'},maxOptionsText:function(t,u){return[1==t?'Limit reached ({n} item max)':'Limit reached ({n} items max)',1==u?'Group limit reached ({n} item max)':'Group limit reached ({n} items max)']},selectAllText:'Select All',deselectAllText:'Deselect All',doneButton:!1,doneButtonText:'Close',multipleSeparator:', ',styleBase:'btn',style:'btn-default',size:'auto',title:null,selectedTextFormat:'values',width:!1,container:!1,hideDisabled:!1,showSubtext:!1,showIcon:!0,showContent:!0,dropupAuto:!0,header:!1,liveSearch:!1,liveSearchPlaceholder:null,liveSearchNormalize:!1,liveSearchStyle:'contains',actionsBox:!1,iconBase:'glyphicon',tickIcon:'glyphicon-ok',showTick:!1,template:{caret:'<span class="caret"></span>'},maxOptions:!1,mobile:!1,selectOnTab:!1,dropdownAlignRight:!1,windowPadding:0},q.prototype={constructor:q,init:function(){var t=this,u=this.$element.attr('id');this.$element.addClass('bs-select-hidden'),this.liObj={},this.multiple=this.$element.prop('multiple'),this.autofocus=this.$element.prop('autofocus'),this.$newElement=this.createView(),this.$element.after(this.$newElement).appendTo(this.$newElement),this.$button=this.$newElement.children('button'),this.$menu=this.$newElement.children('.dropdown-menu'),this.$menuInner=this.$menu.children('.inner'),this.$searchbox=this.$menu.find('input'),this.$element.removeClass('bs-select-hidden'),!0===this.options.dropdownAlignRight&&this.$menu.addClass('dropdown-menu-right'),'undefined'!=typeof u&&(this.$button.attr('data-id',u),b('label[for="'+u+'"]').click(function(v){v.preventDefault(),t.$button.focus()})),this.checkDisabled(),this.clickListener(),this.options.liveSearch&&this.liveSearchListener(),this.render(),this.setStyle(),this.setWidth(),this.options.container&&this.selectPosition(),this.$menu.data('this',this),this.$newElement.data('this',this),this.options.mobile&&this.mobile(),this.$newElement.on({'hide.bs.dropdown':function(v){t.$menuInner.attr('aria-expanded',!1),t.$element.trigger('hide.bs.select',v)},'hidden.bs.dropdown':function(v){t.$element.trigger('hidden.bs.select',v)},'show.bs.dropdown':function(v){t.$menuInner.attr('aria-expanded',!0),t.$element.trigger('show.bs.select',v)},'shown.bs.dropdown':function(v){t.$element.trigger('shown.bs.select',v)}}),t.$element[0].hasAttribute('required')&&this.$element.on('invalid',function(){t.$button.addClass('bs-invalid').focus(),t.$element.on({'focus.bs.select':function(){t.$button.focus(),t.$element.off('focus.bs.select')},'shown.bs.select':function(){t.$element.val(t.$element.val()).off('shown.bs.select')},'rendered.bs.select':function(){this.validity.valid&&t.$button.removeClass('bs-invalid'),t.$element.off('rendered.bs.select')}})}),setTimeout(function(){t.$element.trigger('loaded.bs.select')})},createDropdown:function(){var t=this.multiple||this.options.showTick?' show-tick':'',u=this.$element.parent().hasClass('input-group')?' input-group-btn':'',v=this.autofocus?' autofocus':'',w=this.options.header?'<div class="popover-title"><button type="button" class="close" aria-hidden="true">&times;</button>'+this.options.header+'</div>':'',x=this.options.liveSearch?'<div class="bs-searchbox"><input type="text" class="form-control" autocomplete="off"'+(null===this.options.liveSearchPlaceholder?'':' placeholder="'+n(this.options.liveSearchPlaceholder)+'"')+' role="textbox" aria-label="Search"></div>':'',y=this.multiple&&this.options.actionsBox?'<div class="bs-actionsbox"><div class="btn-group btn-group-sm btn-block"><button type="button" class="actions-btn bs-select-all btn btn-default">'+this.options.selectAllText+'</button><button type="button" class="actions-btn bs-deselect-all btn btn-default">'+this.options.deselectAllText+'</button></div></div>':'',z=this.multiple&&this.options.doneButton?'<div class="bs-donebutton"><div class="btn-group btn-block"><button type="button" class="btn btn-sm btn-default">'+this.options.doneButtonText+'</button></div></div>':'',A='<div class="btn-group bootstrap-select'+t+u+'"><button type="button" class="'+this.options.styleBase+' dropdown-toggle" data-toggle="dropdown"'+v+' role="button"><span class="filter-option pull-left"></span>&nbsp;<span class="bs-caret">'+this.options.template.caret+'</span></button><div class="dropdown-menu open" role="combobox">'+w+x+y+'<ul class="dropdown-menu inner" role="listbox" aria-expanded="false"></ul>'+z+'</div></div>';return b(A)},createView:function(){var t=this.createDropdown(),u=this.createLi();return t.find('ul')[0].innerHTML=u,t},reloadLi:function(){var t=this.createLi();this.$menuInner[0].innerHTML=t},createLi:function(){var t=this,u=[],v=0,w=document.createElement('option'),x=-1,y=function(C,D,E,F){return'<li'+('undefined'!=typeof E&''!==E?' class="'+E+'"':'')+('undefined'!=typeof D&null!==D?' data-original-index="'+D+'"':'')+('undefined'!=typeof F&null!==F?'data-optgroup="'+F+'"':'')+'>'+C+'</li>'},z=function(C,D,E,F){return'<a tabindex="0"'+('undefined'==typeof D?'':' class="'+D+'"')+(E?' style="'+E+'"':'')+(t.options.liveSearchNormalize?' data-normalized-text="'+c(n(b(C).html()))+'"':'')+('undefined'!=typeof F||null!==F?' data-tokens="'+F+'"':'')+' role="option">'+C+'<span class="'+t.options.iconBase+' '+t.options.tickIcon+' check-mark"></span></a>'};if(this.options.title&&!this.multiple&&(x--,!this.$element.find('.bs-title-option').length)){var A=this.$element[0];w.className='bs-title-option',w.innerHTML=this.options.title,w.value='',A.insertBefore(w,A.firstChild);var B=b(A.options[A.selectedIndex]);void 0===B.attr('selected')&&void 0===this.$element.data('selected')&&(w.selected=!0)}return this.$element.find('option').each(function(C){var D=b(this);if(x++,!D.hasClass('bs-title-option')){var E=this.className||'',F=this.style.cssText,G=D.data('content')?D.data('content'):D.html(),H=D.data('tokens')?D.data('tokens'):null,I='undefined'==typeof D.data('subtext')?'':'<small class="text-muted">'+D.data('subtext')+'</small>',J='undefined'==typeof D.data('icon')?'':'<span class="'+t.options.iconBase+' '+D.data('icon')+'"></span> ',K=D.parent(),L='OPTGROUP'===K[0].tagName,M=L&&K[0].disabled,N=this.disabled||M;if(''!=J&&N&&(J='<span>'+J+'</span>'),t.options.hideDisabled&&(N&&!L||M))return void x--;if(D.data('content')||(G=J+'<span class="text">'+G+I+'</span>'),L&&!0!==D.data('divider')){if(t.options.hideDisabled&&N){if(void 0===K.data('allOptionsDisabled')){var O=K.children();K.data('allOptionsDisabled',O.filter(':disabled').length===O.length)}if(K.data('allOptionsDisabled'))return void x--}var P=' '+K[0].className||'';if(0===D.index()){v+=1;var Q=K[0].label,R='undefined'==typeof K.data('subtext')?'':'<small class="text-muted">'+K.data('subtext')+'</small>',S=K.data('icon')?'<span class="'+t.options.iconBase+' '+K.data('icon')+'"></span> ':'';Q=S+'<span class="text">'+n(Q)+R+'</span>',0!==C&&0<u.length&&(x++,u.push(y('',null,'divider',v+'div'))),x++,u.push(y(Q,null,'dropdown-header'+P,v))}if(t.options.hideDisabled&&N)return void x--;u.push(y(z(G,'opt '+E+P,F,H),C,'',v))}else if(!0===D.data('divider'))u.push(y('',C,'divider'));else if(!0===D.data('hidden'))u.push(y(z(G,E,F,H),C,'hidden is-hidden'));else{var T=this.previousElementSibling&&'OPTGROUP'===this.previousElementSibling.tagName;if(!T&&t.options.hideDisabled)for(var U=b(this).prevAll(),V=0;V<U.length;V++)if('OPTGROUP'===U[V].tagName){for(var Y,W=0,X=0;X<V;X++)Y=U[X],(Y.disabled||!0===b(Y).data('hidden'))&&W++;W===V&&(T=!0);break}T&&(x++,u.push(y('',null,'divider',v+'div'))),u.push(y(z(G,E,F,H),C))}t.liObj[C]=x}}),this.multiple||0!==this.$element.find('option:selected').length||this.options.title||this.$element.find('option').eq(0).prop('selected',!0).attr('selected','selected'),u.join('')},findLis:function(){return null==this.$lis&&(this.$lis=this.$menu.find('li')),this.$lis},render:function(t){var v,u=this;!1!==t&&this.$element.find('option').each(function(B){var C=u.findLis().eq(u.liObj[B]);u.setDisabled(B,this.disabled||'OPTGROUP'===this.parentNode.tagName&&this.parentNode.disabled,C),u.setSelected(B,this.selected,C)}),this.togglePlaceholder(),this.tabIndex();var w=this.$element.find('option').map(function(){if(this.selected){if(u.options.hideDisabled&&(this.disabled||'OPTGROUP'===this.parentNode.tagName&&this.parentNode.disabled))return;var D,B=b(this),C=B.data('icon')&&u.options.showIcon?'<i class="'+u.options.iconBase+' '+B.data('icon')+'"></i> ':'';return D=u.options.showSubtext&&B.data('subtext')&&!u.multiple?' <small class="text-muted">'+B.data('subtext')+'</small>':'','undefined'==typeof B.attr('title')?B.data('content')&&u.options.showContent?B.data('content').toString():C+B.html()+D:B.attr('title')}}).toArray(),x=this.multiple?w.join(this.options.multipleSeparator):w[0];if(this.multiple&&-1<this.options.selectedTextFormat.indexOf('count')){var y=this.options.selectedTextFormat.split('>');if(1<y.length&&w.length>y[1]||1==y.length&&2<=w.length){v=this.options.hideDisabled?', [disabled]':'';var z=this.$element.find('option').not('[data-divider="true"], [data-hidden="true"]'+v).length,A='function'==typeof this.options.countSelectedText?this.options.countSelectedText(w.length,z):this.options.countSelectedText;x=A.replace('{0}',w.length.toString()).replace('{1}',z.toString())}}this.options.title==void 0&&(this.options.title=this.$element.attr('title')),'static'==this.options.selectedTextFormat&&(x=this.options.title),x||(x='undefined'==typeof this.options.title?this.options.noneSelectedText:this.options.title),this.$button.attr('title',p(b.trim(x.replace(/<[^>]*>?/g,'')))),this.$button.children('.filter-option').html(x),this.$element.trigger('rendered.bs.select')},setStyle:function(t,u){this.$element.attr('class')&&this.$newElement.addClass(this.$element.attr('class').replace(/selectpicker|mobile-device|bs-select-hidden|validate\[.*\]/gi,''));var v=t?t:this.options.style;'add'==u?this.$button.addClass(v):'remove'==u?this.$button.removeClass(v):(this.$button.removeClass(this.options.style),this.$button.addClass(v))},liHeight:function(t){if(t||!1!==this.options.size&&!this.sizeInfo){var u=document.createElement('div'),v=document.createElement('div'),w=document.createElement('ul'),x=document.createElement('li'),y=document.createElement('li'),z=document.createElement('a'),A=document.createElement('span'),B=this.options.header&&0<this.$menu.find('.popover-title').length?this.$menu.find('.popover-title')[0].cloneNode(!0):null,C=this.options.liveSearch?document.createElement('div'):null,D=this.options.actionsBox&&this.multiple&&0<this.$menu.find('.bs-actionsbox').length?this.$menu.find('.bs-actionsbox')[0].cloneNode(!0):null,E=this.options.doneButton&&this.multiple&&0<this.$menu.find('.bs-donebutton').length?this.$menu.find('.bs-donebutton')[0].cloneNode(!0):null;if(A.className='text',u.className=this.$menu[0].parentNode.className+' open',v.className='dropdown-menu open',w.className='dropdown-menu inner',x.className='divider',A.appendChild(document.createTextNode('Inner text')),z.appendChild(A),y.appendChild(z),w.appendChild(y),w.appendChild(x),B&&v.appendChild(B),C){var F=document.createElement('input');C.className='bs-searchbox',F.className='form-control',C.appendChild(F),v.appendChild(C)}D&&v.appendChild(D),v.appendChild(w),E&&v.appendChild(E),u.appendChild(v),document.body.appendChild(u);var G=z.offsetHeight,H=B?B.offsetHeight:0,I=C?C.offsetHeight:0,J=D?D.offsetHeight:0,K=E?E.offsetHeight:0,L=b(x).outerHeight(!0),M='function'==typeof getComputedStyle&&getComputedStyle(v),N=M?null:b(v),O={vert:parseInt(M?M.paddingTop:N.css('paddingTop'))+parseInt(M?M.paddingBottom:N.css('paddingBottom'))+parseInt(M?M.borderTopWidth:N.css('borderTopWidth'))+parseInt(M?M.borderBottomWidth:N.css('borderBottomWidth')),horiz:parseInt(M?M.paddingLeft:N.css('paddingLeft'))+parseInt(M?M.paddingRight:N.css('paddingRight'))+parseInt(M?M.borderLeftWidth:N.css('borderLeftWidth'))+parseInt(M?M.borderRightWidth:N.css('borderRightWidth'))},P={vert:O.vert+parseInt(M?M.marginTop:N.css('marginTop'))+parseInt(M?M.marginBottom:N.css('marginBottom'))+2,horiz:O.horiz+parseInt(M?M.marginLeft:N.css('marginLeft'))+parseInt(M?M.marginRight:N.css('marginRight'))+2};document.body.removeChild(u),this.sizeInfo={liHeight:G,headerHeight:H,searchHeight:I,actionsHeight:J,doneButtonHeight:K,dividerHeight:L,menuPadding:O,menuExtras:P}}},setSize:function(){if(this.findLis(),this.liHeight(),this.options.header&&this.$menu.css('padding-top',0),!1!==this.options.size){var I,J,K,L,M,N,O,P,t=this,u=this.$menu,v=this.$menuInner,w=b(window),x=this.$newElement[0].offsetHeight,y=this.$newElement[0].offsetWidth,z=this.sizeInfo.liHeight,A=this.sizeInfo.headerHeight,B=this.sizeInfo.searchHeight,C=this.sizeInfo.actionsHeight,D=this.sizeInfo.doneButtonHeight,E=this.sizeInfo.dividerHeight,F=this.sizeInfo.menuPadding,G=this.sizeInfo.menuExtras,H=this.options.hideDisabled?'.disabled':'',Q=function(){var W,U=t.$newElement.offset(),V=b(t.options.container);t.options.container&&!V.is('body')?(W=V.offset(),W.top+=parseInt(V.css('borderTopWidth')),W.left+=parseInt(V.css('borderLeftWidth'))):W={top:0,left:0};var X=t.options.windowPadding;M=U.top-W.top-w.scrollTop(),N=w.height()-M-x-W.top-X[2],O=U.left-W.left-w.scrollLeft(),P=w.width()-O-y-W.left-X[1],M-=X[0],O-=X[3]};if(Q(),'auto'===this.options.size){var R=function(){var U,V=function(Z,_){return function(aa){return _?aa.classList?aa.classList.contains(Z):b(aa).hasClass(Z):aa.classList?!aa.classList.contains(Z):!b(aa).hasClass(Z)}},W=t.$menuInner[0].getElementsByTagName('li'),X=Array.prototype.filter?Array.prototype.filter.call(W,V('hidden',!1)):t.$lis.not('.hidden'),Y=Array.prototype.filter?Array.prototype.filter.call(X,V('dropdown-header',!0)):X.filter('.dropdown-header');Q(),I=N-G.vert,J=P-G.horiz,t.options.container?(!u.data('height')&&u.data('height',u.height()),K=u.data('height'),!u.data('width')&&u.data('width',u.width()),L=u.data('width')):(K=u.height(),L=u.width()),t.options.dropupAuto&&t.$newElement.toggleClass('dropup',M>N&&I-G.vert<K),t.$newElement.hasClass('dropup')&&(I=M-G.vert),'auto'===t.options.dropdownAlignRight&&u.toggleClass('dropdown-menu-right',O>P&&J-G.horiz<L-y),U=3<X.length+Y.length?3*z+G.vert-2:0,u.css({'max-height':I+'px',overflow:'hidden','min-height':U+A+B+C+D+'px'}),v.css({'max-height':I-A-B-C-D-F.vert+'px','overflow-y':'auto','min-height':Math.max(U-F.vert,0)+'px'})};R(),this.$searchbox.off('input.getSize propertychange.getSize').on('input.getSize propertychange.getSize',R),w.off('resize.getSize scroll.getSize').on('resize.getSize scroll.getSize',R)}else if(this.options.size&&'auto'!=this.options.size&&this.$lis.not(H).length>this.options.size){var S=this.$lis.not('.divider').not(H).children().slice(0,this.options.size).last().parent().index(),T=this.$lis.slice(0,S+1).filter('.divider').length;I=z*this.options.size+T*E+F.vert,t.options.container?(!u.data('height')&&u.data('height',u.height()),K=u.data('height')):K=u.height(),t.options.dropupAuto&&this.$newElement.toggleClass('dropup',M>N&&I-G.vert<K),u.css({'max-height':I+A+B+C+D+'px',overflow:'hidden','min-height':''}),v.css({'max-height':I-F.vert+'px','overflow-y':'auto','min-height':''})}}},setWidth:function(){if('auto'===this.options.width){this.$menu.css('min-width','0');var t=this.$menu.parent().clone().appendTo('body'),u=this.options.container?this.$newElement.clone().appendTo('body'):t,v=t.children('.dropdown-menu').outerWidth(),w=u.css('width','auto').children('button').outerWidth();t.remove(),u.remove(),this.$newElement.css('width',Math.max(v,w)+'px')}else'fit'===this.options.width?(this.$menu.css('min-width',''),this.$newElement.css('width','').addClass('fit-width')):this.options.width?(this.$menu.css('min-width',''),this.$newElement.css('width',this.options.width)):(this.$menu.css('min-width',''),this.$newElement.css('width',''));this.$newElement.hasClass('fit-width')&&'fit'!==this.options.width&&this.$newElement.removeClass('fit-width')},selectPosition:function(){this.$bsContainer=b('<div class="bs-container" />');var v,w,x,t=this,u=b(this.options.container),y=function(z){t.$bsContainer.addClass(z.attr('class').replace(/form-control|fit-width/gi,'')).toggleClass('dropup',z.hasClass('dropup')),v=z.offset(),u.is('body')?w={top:0,left:0}:(w=u.offset(),w.top+=parseInt(u.css('borderTopWidth'))-u.scrollTop(),w.left+=parseInt(u.css('borderLeftWidth'))-u.scrollLeft()),x=z.hasClass('dropup')?0:z[0].offsetHeight,t.$bsContainer.css({top:v.top-w.top+x,left:v.left-w.left,width:z[0].offsetWidth})};this.$button.on('click',function(){var z=b(this);t.isDisabled()||(y(t.$newElement),t.$bsContainer.appendTo(t.options.container).toggleClass('open',!z.hasClass('open')).append(t.$menu))}),b(window).on('resize scroll',function(){y(t.$newElement)}),this.$element.on('hide.bs.select',function(){t.$menu.data('height',t.$menu.height()),t.$bsContainer.detach()})},setSelected:function(t,u,v){v||(this.togglePlaceholder(),v=this.findLis().eq(this.liObj[t])),v.toggleClass('selected',u).find('a').attr('aria-selected',u)},setDisabled:function(t,u,v){v||(v=this.findLis().eq(this.liObj[t])),u?v.addClass('disabled').children('a').attr('href','#').attr('tabindex',-1).attr('aria-disabled',!0):v.removeClass('disabled').children('a').removeAttr('href').attr('tabindex',0).attr('aria-disabled',!1)},isDisabled:function(){return this.$element[0].disabled},checkDisabled:function(){var t=this;this.isDisabled()?(this.$newElement.addClass('disabled'),this.$button.addClass('disabled').attr('tabindex',-1).attr('aria-disabled',!0)):(this.$button.hasClass('disabled')&&(this.$newElement.removeClass('disabled'),this.$button.removeClass('disabled').attr('aria-disabled',!1)),-1==this.$button.attr('tabindex')&&!this.$element.data('tabindex')&&this.$button.removeAttr('tabindex')),this.$button.click(function(){return!t.isDisabled()})},togglePlaceholder:function(){var t=this.$element.val();this.$button.toggleClass('bs-placeholder',null===t||''===t||t.constructor===Array&&0===t.length)},tabIndex:function(){this.$element.data('tabindex')!==this.$element.attr('tabindex')&&-98!==this.$element.attr('tabindex')&&'-98'!==this.$element.attr('tabindex')&&(this.$element.data('tabindex',this.$element.attr('tabindex')),this.$button.attr('tabindex',this.$element.data('tabindex'))),this.$element.attr('tabindex',-98)},clickListener:function(){var t=this,u=b(document);u.data('spaceSelect',!1),this.$button.on('keyup',function(v){/(32)/.test(v.keyCode.toString(10))&&u.data('spaceSelect')&&(v.preventDefault(),u.data('spaceSelect',!1))}),this.$button.on('click',function(){t.setSize()}),this.$element.on('shown.bs.select',function(){if(!t.options.liveSearch&&!t.multiple)t.$menuInner.find('.selected a').focus();else if(!t.multiple){var v=t.liObj[t.$element[0].selectedIndex];if('number'!=typeof v||!1===t.options.size)return;var w=t.$lis.eq(v)[0].offsetTop-t.$menuInner[0].offsetTop;w=w-t.$menuInner[0].offsetHeight/2+t.sizeInfo.liHeight/2,t.$menuInner[0].scrollTop=w}}),this.$menuInner.on('click','li a',function(v){var w=b(this),x=w.parent().data('originalIndex'),y=t.$element.val(),z=t.$element.prop('selectedIndex'),A=!0;if(t.multiple&&1!==t.options.maxOptions&&v.stopPropagation(),v.preventDefault(),!t.isDisabled()&&!w.parent().hasClass('disabled')){var B=t.$element.find('option'),C=B.eq(x),D=C.prop('selected'),E=C.parent('optgroup'),F=t.options.maxOptions,G=E.data('maxOptions')||!1;if(!t.multiple)B.prop('selected',!1),C.prop('selected',!0),t.$menuInner.find('.selected').removeClass('selected').find('a').attr('aria-selected',!1),t.setSelected(x,!0);else if(C.prop('selected',!D),t.setSelected(x,!D),w.blur(),!1!==F||!1!==G){var H=F<B.filter(':selected').length,I=G<E.find('option:selected').length;if(F&&H||G&&I)if(F&&1==F)B.prop('selected',!1),C.prop('selected',!0),t.$menuInner.find('.selected').removeClass('selected'),t.setSelected(x,!0);else if(G&&1==G){E.find('option:selected').prop('selected',!1),C.prop('selected',!0);var J=w.parent().data('optgroup');t.$menuInner.find('[data-optgroup="'+J+'"]').removeClass('selected'),t.setSelected(x,!0)}else{var K='string'==typeof t.options.maxOptionsText?[t.options.maxOptionsText,t.options.maxOptionsText]:t.options.maxOptionsText,L='function'==typeof K?K(F,G):K,M=L[0].replace('{n}',F),N=L[1].replace('{n}',G),O=b('<div class="notify"></div>');L[2]&&(M=M.replace('{var}',L[2][1<F?0:1]),N=N.replace('{var}',L[2][1<G?0:1])),C.prop('selected',!1),t.$menu.append(O),F&&H&&(O.append(b('<div>'+M+'</div>')),A=!1,t.$element.trigger('maxReached.bs.select')),G&&I&&(O.append(b('<div>'+N+'</div>')),A=!1,t.$element.trigger('maxReachedGrp.bs.select')),setTimeout(function(){t.setSelected(x,!1)},10),O.delay(750).fadeOut(300,function(){b(this).remove()})}}!t.multiple||t.multiple&&1===t.options.maxOptions?t.$button.focus():t.options.liveSearch&&t.$searchbox.focus(),A&&(y!=t.$element.val()&&t.multiple||z!=t.$element.prop('selectedIndex')&&!t.multiple)&&(h=[x,C.prop('selected'),D],t.$element.triggerNative('change'))}}),this.$menu.on('click','li.disabled a, .popover-title, .popover-title :not(.close)',function(v){v.currentTarget==this&&(v.preventDefault(),v.stopPropagation(),t.options.liveSearch&&!b(v.target).hasClass('close')?t.$searchbox.focus():t.$button.focus())}),this.$menuInner.on('click','.divider, .dropdown-header',function(v){v.preventDefault(),v.stopPropagation(),t.options.liveSearch?t.$searchbox.focus():t.$button.focus()}),this.$menu.on('click','.popover-title .close',function(){t.$button.click()}),this.$searchbox.on('click',function(v){v.stopPropagation()}),this.$menu.on('click','.actions-btn',function(v){t.options.liveSearch?t.$searchbox.focus():t.$button.focus(),v.preventDefault(),v.stopPropagation(),b(this).hasClass('bs-select-all')?t.selectAll():t.deselectAll()}),this.$element.change(function(){t.render(!1),t.$element.trigger('changed.bs.select',h),h=null})},liveSearchListener:function(){var t=this,u=b('<li class="no-results"></li>');this.$button.on('click.dropdown.data-api',function(){t.$menuInner.find('.active').removeClass('active'),!t.$searchbox.val()||(t.$searchbox.val(''),t.$lis.not('.is-hidden').removeClass('hidden'),!!u.parent().length&&u.remove()),t.multiple||t.$menuInner.find('.selected').addClass('active'),setTimeout(function(){t.$searchbox.focus()},10)}),this.$searchbox.on('click.dropdown.data-api focus.dropdown.data-api touchend.dropdown.data-api',function(v){v.stopPropagation()}),this.$searchbox.on('input propertychange',function(){if(t.$lis.not('.is-hidden').removeClass('hidden'),t.$lis.filter('.active').removeClass('active'),u.remove(),t.$searchbox.val()){var w,v=t.$lis.not('.is-hidden, .divider, .dropdown-header');if(w=t.options.liveSearchNormalize?v.find('a').not(':a'+t._searchStyle()+'("'+c(t.$searchbox.val())+'")'):v.find('a').not(':'+t._searchStyle()+'("'+t.$searchbox.val()+'")'),w.length===v.length)u.html(t.options.noneResultsText.replace('{0}','"'+n(t.$searchbox.val())+'"')),t.$menuInner.append(u),t.$lis.addClass('hidden');else{w.parent().addClass('hidden');var y,x=t.$lis.not('.hidden');x.each(function(z){var A=b(this);A.hasClass('divider')?void 0==y?A.addClass('hidden'):(y&&y.addClass('hidden'),y=A):A.hasClass('dropdown-header')&&x.eq(z+1).data('optgroup')!==A.data('optgroup')?A.addClass('hidden'):y=null}),y&&y.addClass('hidden'),v.not('.hidden').first().addClass('active')}}})},_searchStyle:function(){return{begins:'ibegins',startsWith:'ibegins'}[this.options.liveSearchStyle]||'icontains'},val:function(t){return'undefined'==typeof t?this.$element.val():(this.$element.val(t),this.render(),this.$element)},changeAll:function(t){if(this.multiple){'undefined'==typeof t&&(t=!0),this.findLis();var u=this.$element.find('option'),v=this.$lis.not('.divider, .dropdown-header, .disabled, .hidden'),w=v.length,x=[];if(t){if(v.filter('.selected').length===v.length)return;}else if(0===v.filter('.selected').length)return;v.toggleClass('selected',t);for(var z,y=0;y<w;y++)z=v[y].getAttribute('data-original-index'),x[x.length]=u.eq(z)[0];b(x).prop('selected',t),this.render(!1),this.togglePlaceholder(),this.$element.triggerNative('change')}},selectAll:function(){return this.changeAll(!0)},deselectAll:function(){return this.changeAll(!1)},toggle:function(t){t=t||window.event,t&&t.stopPropagation(),this.$button.trigger('click')},keydown:function(t){var w,y,z,A,B,C,D,E,F,u=b(this),v=u.is('input')?u.parent().parent():u.parent(),x=v.data('this'),G=':not(.disabled, .hidden, .dropdown-header, .divider)',H={32:' ',48:'0',49:'1',50:'2',51:'3',52:'4',53:'5',54:'6',55:'7',56:'8',57:'9',59:';',65:'a',66:'b',67:'c',68:'d',69:'e',70:'f',71:'g',72:'h',73:'i',74:'j',75:'k',76:'l',77:'m',78:'n',79:'o',80:'p',81:'q',82:'r',83:'s',84:'t',85:'u',86:'v',87:'w',88:'x',89:'y',90:'z',96:'0',97:'1',98:'2',99:'3',100:'4',101:'5',102:'6',103:'7',104:'8',105:'9'};if(x.options.liveSearch&&(v=u.parent().parent()),x.options.container&&(v=x.$menu),w=b('[role="listbox"] li',v),F=x.$newElement.hasClass('open'),!F&&(48<=t.keyCode&&57>=t.keyCode||96<=t.keyCode&&105>=t.keyCode||65<=t.keyCode&&90>=t.keyCode))return x.options.container?x.$button.trigger('click'):(x.setSize(),x.$menu.parent().addClass('open'),F=!0),void x.$searchbox.focus();if(x.options.liveSearch&&(/(^9$|27)/.test(t.keyCode.toString(10))&&F&&(t.preventDefault(),t.stopPropagation(),x.$menuInner.click(),x.$button.focus()),w=b('[role="listbox"] li'+G,v),!u.val()&&!/(38|40)/.test(t.keyCode.toString(10))&&0===w.filter('.active').length&&(w=x.$menuInner.find('li'),w=x.options.liveSearchNormalize?w.filter(':a'+x._searchStyle()+'('+c(H[t.keyCode])+')'):w.filter(':'+x._searchStyle()+'('+H[t.keyCode]+')'))),!!w.length){if(/(38|40)/.test(t.keyCode.toString(10)))y=w.index(w.find('a').filter(':focus').parent()),A=w.filter(G).first().index(),B=w.filter(G).last().index(),z=w.eq(y).nextAll(G).eq(0).index(),C=w.eq(y).prevAll(G).eq(0).index(),D=w.eq(z).prevAll(G).eq(0).index(),x.options.liveSearch&&(w.each(function(M){b(this).hasClass('disabled')||b(this).data('index',M)}),y=w.index(w.filter('.active')),A=w.first().data('index'),B=w.last().data('index'),z=w.eq(y).nextAll().eq(0).data('index'),C=w.eq(y).prevAll().eq(0).data('index'),D=w.eq(z).prevAll().eq(0).data('index')),E=u.data('prevIndex'),38==t.keyCode?(x.options.liveSearch&&y--,y!=D&&y>C&&(y=C),y<A&&(y=A),y==E&&(y=B)):40==t.keyCode&&(x.options.liveSearch&&y++,-1==y&&(y=0),y!=D&&y<z&&(y=z),y>B&&(y=B),y==E&&(y=A)),u.data('prevIndex',y),x.options.liveSearch?(t.preventDefault(),!u.hasClass('dropdown-toggle')&&(w.removeClass('active').eq(y).addClass('active').children('a').focus(),u.focus())):w.eq(y).children('a').focus();else if(!u.is('input')){var J,K,I=[];w.each(function(){b(this).hasClass('disabled')||b.trim(b(this).children('a').text().toLowerCase()).substring(0,1)!=H[t.keyCode]||I.push(b(this).index())}),J=b(document).data('keycount'),J++,b(document).data('keycount',J),K=b.trim(b(':focus').text().toLowerCase()).substring(0,1),K==H[t.keyCode]?J>=I.length&&(b(document).data('keycount',0),J>I.length&&(J=1)):(J=1,b(document).data('keycount',J)),w.eq(I[J-1]).children('a').focus()}if((/(13|32)/.test(t.keyCode.toString(10))||/(^9$)/.test(t.keyCode.toString(10))&&x.options.selectOnTab)&&F){if(/(32)/.test(t.keyCode.toString(10))||t.preventDefault(),!x.options.liveSearch){var L=b(':focus');L.click(),L.focus(),t.preventDefault(),b(document).data('spaceSelect',!0)}else /(32)/.test(t.keyCode.toString(10))||(x.$menuInner.find('.active a').click(),u.focus());b(document).data('keycount',0)}(/(^9$|27)/.test(t.keyCode.toString(10))&&F&&(x.multiple||x.options.liveSearch)||/(27)/.test(t.keyCode.toString(10))&&!F)&&(x.$menu.parent().removeClass('open'),x.options.container&&x.$newElement.removeClass('open'),x.$button.focus())}},mobile:function(){this.$element.addClass('mobile-device')},refresh:function(){this.$lis=null,this.liObj={},this.reloadLi(),this.render(),this.checkDisabled(),this.liHeight(!0),this.setStyle(),this.setWidth(),this.$lis&&this.$searchbox.trigger('propertychange'),this.$element.trigger('refreshed.bs.select')},hide:function(){this.$newElement.hide()},show:function(){this.$newElement.show()},remove:function(){this.$newElement.remove(),this.$element.remove()},destroy:function(){this.$newElement.before(this.$element).remove(),this.$bsContainer?this.$bsContainer.remove():this.$menu.remove(),this.$element.off('.bs.select').removeData('selectpicker').removeClass('bs-select-hidden selectpicker')}};var s=b.fn.selectpicker;b.fn.selectpicker=f,b.fn.selectpicker.Constructor=q,b.fn.selectpicker.noConflict=function(){return b.fn.selectpicker=s,this},b(document).data('keycount',0).on('keydown.bs.select','.bootstrap-select [data-toggle=dropdown], .bootstrap-select [role="listbox"], .bs-searchbox input',q.prototype.keydown).on('focusin.modal','.bootstrap-select [data-toggle=dropdown], .bootstrap-select [role="listbox"], .bs-searchbox input',function(t){t.stopPropagation()}),b(window).on('load.bs.select.data-api',function(){b('.selectpicker').each(function(){var t=b(this);f.call(t,t.data())})})})(jQuery);
