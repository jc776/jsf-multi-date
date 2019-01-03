package com.canopyasp.canopynet.os.taglib2;

import java.util.Arrays;
import java.util.Collection;
import java.util.Collections;
import java.util.Date;
import java.util.Set;

import javax.faces.application.ResourceDependency;
import javax.faces.component.FacesComponent;
import javax.faces.component.UIInput;
import javax.faces.component.UINamingContainer;
import javax.faces.component.behavior.ClientBehaviorHolder;
import javax.faces.context.FacesContext;

import org.primefaces.component.api.Widget;

@FacesComponent(value = MultiDatePicker.COMPONENT_TYPE)
@ResourceDependency(library = "primefaces", name = "jquery/jquery.js")
@ResourceDependency(library = "primefaces", name = "core.js")
@ResourceDependency(library = "primefaces", name = "components.js")
@ResourceDependency(library = "date", name = "react.production.min.js")
@ResourceDependency(library = "date", name = "react-dom.production.min.js")
@ResourceDependency(library = "date", name = "react-daypicker.min.js")
@ResourceDependency(library = "date", name = "react-daypicker.css")
@ResourceDependency(library = "date", name = "MultipleDatePicker.js")
@SuppressWarnings("ucd")
public class MultiDatePicker extends UIInput implements Widget, ClientBehaviorHolder {
  // dont rename these constants they are used directly in javascript
  protected static enum PropertyKeys {
    value, widgetVar, minDate, maxDate, readOnly;
  }

  private static final String EVENT_CHANGE = "change"; //$NON-NLS-1$
  private static final Collection<String> EVENT_NAMES = Collections
      .unmodifiableCollection(Arrays.asList(MultiDatePicker.EVENT_CHANGE));
  static final String COMPONENT_TYPE = "com.canopyasp.canopynet.os.taglib2.MultiDatePicker"; //$NON-NLS-1$
  static final String COMPONENT_FAMILY = "com.canopyasp.canopynet.os.taglib2.components"; //$NON-NLS-1$

  @Override
  public String getDefaultEventName() {
    return MultiDatePicker.EVENT_CHANGE;
  }

  @Override
  public Collection<String> getEventNames() {
    return MultiDatePicker.EVENT_NAMES;
  }

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

  public Boolean isReadOnly() {
    return (Boolean) this.getStateHelper().eval(PropertyKeys.readOnly, null);
  }

  @Override
  public String resolveWidgetVar() {
    final String userWidgetVar = (String) this.getAttributes().get(PropertyKeys.widgetVar.name());
    if (userWidgetVar != null) {
      return userWidgetVar;
    }
    final FacesContext context = this.getFacesContext();
    return "widget_" + this.getClientId(context) //$NON-NLS-1$
        .replaceAll("-|" + UINamingContainer.getSeparatorChar(context), "_"); //$NON-NLS-1$//$NON-NLS-2$
  }

  public void setMaxDate(final Date maxDate) {
    this.getStateHelper().put(PropertyKeys.maxDate, maxDate);
  }

  public void setMinDate(final Date minDate) {
    this.getStateHelper().put(PropertyKeys.minDate, minDate);
  }

  public void setReadOnly(final boolean readOnly) {
    this.getStateHelper().put(PropertyKeys.readOnly, readOnly);
  }

  public void setWidgetVar(final String widgetVar) {
    this.getStateHelper().put(PropertyKeys.widgetVar, widgetVar);
  }
}