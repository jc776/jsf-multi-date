package com.jc776.eetest;

import java.util.Date;
import java.util.Set;

import javax.faces.application.ResourceDependencies;
import javax.faces.application.ResourceDependency;
import javax.faces.component.FacesComponent;
import javax.faces.component.UIInput;
import javax.faces.component.UINamingContainer;
import javax.faces.context.FacesContext;

import org.primefaces.component.api.Widget;

@FacesComponent(value = MultiDatePicker.COMPONENT_TYPE)
@ResourceDependencies({
    // @ResourceDependency(library = "moment", name = "moment.min.js"),
    // react
    // react-dom
    @ResourceDependency(library = "primefaces", name = "jquery/jquery.js"),
    @ResourceDependency(library = "primefaces", name = "core.js"),
    @ResourceDependency(library = "primefaces", name = "components.js"),
    @ResourceDependency(library = "jc776", name = "react.production.min.js"),
    @ResourceDependency(library = "jc776", name = "react-dom.production.min.js"),
    @ResourceDependency(library = "jc776", name = "react-daypicker.min.js"),
    @ResourceDependency(library = "jc776", name = "react-daypicker.css"),
    @ResourceDependency(library = "jc776", name = "MultipleDatePicker.js") })
public class MultiDatePicker extends UIInput implements Widget {
  protected static enum PropertyKeys {
    value, widgetVar, minDate, maxDate;
  }

  public static final String COMPONENT_TYPE = "com.jc776.MultiDatePicker";
  public static final String COMPONENT_FAMILY = "com.jc776.components";

  @Override
  public String getFamily() {
    return MultiDatePicker.COMPONENT_FAMILY;
  }

  public Date getMaxDate() {
    return (Date) this.getStateHelper().eval(PropertyKeys.maxDate, null);
  }

  public Date getMinDate() {
    return (Date) this.getStateHelper().eval(PropertyKeys.minDate, null);
  }

  @SuppressWarnings("unchecked")
  @Override
  public Set<Date> getValue() {
    return (Set<Date>) super.getValue();
  }

  public String getWidgetVar() {
    return (String) this.getStateHelper().eval(PropertyKeys.widgetVar, null);
  }

  @Override
  public String resolveWidgetVar() {
    final String userWidgetVar = (String) this.getAttributes()
        .get(PropertyKeys.widgetVar.name());
    if (userWidgetVar != null) {
      return userWidgetVar;
    }
    final FacesContext context = this.getFacesContext();
    return "widget_" + this.getClientId(context)
        .replaceAll("-|" + UINamingContainer.getSeparatorChar(context), "_");
  }

  public void setMaxDate(final Date maxDate) {
    this.getStateHelper().put(PropertyKeys.maxDate, maxDate);
  }

  public void setMinDate(final Date minDate) {
    this.getStateHelper().put(PropertyKeys.minDate, minDate);
  }

  public void setWidgetVar(final String widgetVar) {
    this.getStateHelper().put(PropertyKeys.widgetVar, widgetVar);
  }
}
