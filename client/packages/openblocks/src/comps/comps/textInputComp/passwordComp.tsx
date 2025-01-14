import { Input } from "antd";
import {
  NameConfig,
  NameConfigPlaceHolder,
  NameConfigRequired,
  withExposingConfigs,
} from "comps/generators/withExposing";
import { Section, sectionNames } from "openblocks-design";
import { BoolControl } from "../../controls/boolControl";
import { dropdownControl } from "../../controls/dropdownControl";
import { LabelControl } from "../../controls/labelControl";
import { UICompBuilder, withDefault } from "../../generators";
import { FormDataPropertyView } from "../formComp/formDataConstants";
import {
  getStyle,
  TextInputBasicSection,
  textInputChildren,
  TextInputConfigs,
  TextInputInteractionSection,
  TextInputValidationOptions,
  useTextInputProps,
} from "./textInputConstants";
import { MethodConfigFocus, withMethodExposing } from "../../generators/withMethodExposing";
import { styleControl } from "comps/controls/styleControl";
import styled from "styled-components";
import { InputLikeStyle, InputLikeStyleType } from "comps/controls/styleControlConstants";
import {
  hiddenPropertyView,
  minLengthPropertyView,
  readOnlyPropertyView,
  requiredPropertyView,
  regexPropertyView,
  maxLengthPropertyView,
} from "comps/utils/propertyUtils";
import { trans } from "i18n";

const PasswordStyle = styled(Input.Password)<{
  $style: InputLikeStyleType;
}>`
  ${(props) => props.$style && getStyle(props.$style)}
`;

const PasswordTmpComp = (function () {
  const childrenMap = {
    ...textInputChildren,
    label: withDefault(LabelControl, { text: trans("password.label") }),
    validationType: dropdownControl(TextInputValidationOptions, "Regex"),
    visibilityToggle: BoolControl.DEFAULT_TRUE,
    style: styleControl(InputLikeStyle),
  };
  return new UICompBuilder(childrenMap, (props) => {
    const [inputProps, validateState] = useTextInputProps(props);
    return props.label({
      required: props.required,
      children: (
        <PasswordStyle
          {...inputProps}
          visibilityToggle={props.visibilityToggle}
          $style={props.style}
        />
      ),
      style: props.style,
      ...validateState,
    });
  })
    .setPropertyViewFn((children) => {
      return (
        <>
          <TextInputBasicSection {...children} />
          <FormDataPropertyView {...children} />
          {children.label.getPropertyView()}

          <TextInputInteractionSection {...children} />

          <Section name={sectionNames.advanced}>
            {children.visibilityToggle.propertyView({
              label: trans("password.visibilityToggle"),
            })}
            {readOnlyPropertyView(children)}
          </Section>

          <Section name={sectionNames.validation}>
            {requiredPropertyView(children)}
            {regexPropertyView(children)}
            {minLengthPropertyView(children)}
            {maxLengthPropertyView(children)}
            {children.customRule.propertyView({})}
          </Section>

          <Section name={sectionNames.layout}>{hiddenPropertyView(children)}</Section>

          <Section name={sectionNames.style}>{children.style.getPropertyView()}</Section>
        </>
      );
    })
    .build();
})();

const PasswordTmp2Comp = withMethodExposing(PasswordTmpComp, MethodConfigFocus);

export const PasswordComp = withExposingConfigs(PasswordTmp2Comp, [
  new NameConfig("value", trans("export.inputValueDesc")),
  NameConfigPlaceHolder,
  NameConfigRequired,
  ...TextInputConfigs,
]);
