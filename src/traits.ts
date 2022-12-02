import type grapesjs from 'grapesjs';
import { RequiredPluginOptions } from '.';

export default (editor: grapesjs.Editor, opt: RequiredPluginOptions) => {
    editor.TraitManager.addType('full-width',{
        createInput({trait}){
          let checked="";
          try{
            if(trait.target.getAttributes()['full-width'].hasOwnProperty("full-width")
              && trait.target.getAttributes()['full-width']=="full-width"){
              checked="checked='checked'";
            }
          }catch(e){
            
          }
          const el = document.createElement("div");
          el.innerHTML=`
            <div class="gjs-field-wrp gjs-field-wrp--checkbox">
              <label class="gjs-field gjs-field-checkbox"><input type="checkbox" placeholder="" ${checked} value="full-width">
                <i class="gjs-chk-icon"></i>
              </label>
            </div>
          `;
          return el;
        },
        //Evento que controla e envia as alterações para o componente na model
        onEvent({elInput,component,event}){
          const checkbox = elInput.querySelector('input');
            if(checkbox?.checked){
              component.setAttributes({...component.getAttributes(), "full-width":"full-width" });
            }else{
              component.setAttributes({...component.getAttributes(), "full-width":""});
            }
        }
      })

}