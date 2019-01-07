package com.jc776.eetest;

import java.io.Serializable;
import java.util.Calendar;
import java.util.Date;
import java.util.Iterator;
import java.util.Set;
import java.util.TreeSet;

import javax.annotation.PostConstruct;
import javax.faces.view.ViewScoped;
import javax.inject.Named;

import org.jboss.logging.Logger;

@Named("carShareDates")
@ViewScoped
public class CarShareDatesService implements Serializable {
  private static final long serialVersionUID = 1L;
  private static final Logger log = Logger
      .getLogger(CarShareDatesService.class);
  private Set<Date> dates;
  private Set<Date> selectedDates = new TreeSet<>();
  
  @PostConstruct
  public void init() {
	  this.dates = new TreeSet<>();
      final Calendar cal = Calendar.getInstance();
      for (int i = 0; i < 11; ++i) {
        cal.add(Calendar.DAY_OF_WEEK, 1);
        this.dates.add(cal.getTime());
      }
  }

  public Set<Date> getDates() {
    return this.dates;
  }
  
  public Set<Date> getSelectedDates() {
	  return this.selectedDates;
  }
  


  public Date getMaxDate() {
    final Calendar cal = Calendar.getInstance();
    cal.add(Calendar.MONTH, 3);
    return cal.getTime();
  }

  public Date getMinDate() {
    return new Date();
  }

  public void removeSome() {
    final Iterator<Date> it = this.dates.iterator();
    if (it.hasNext()) {
      it.next();
      it.remove();
    }
  }

  public void setDates(final Set<Date> newDates) {
    CarShareDatesService.log.infof("setDates: %s", newDates);
    // this.dates = newDates - if you trust the client
    for (final Date newDate : newDates) {
      if ((DateHelper.compareDateOnly(newDate, this.getMinDate()) >= 0)
          && (DateHelper.compareDateOnly(newDate, this.getMaxDate()) <= 0)
          && !this.dates.stream()
              .anyMatch(date -> DateHelper.matchDateOnly(date, newDate))) {
        this.dates.add(newDate);
      }
    }
    this.dates.removeIf(
        date -> ((DateHelper.compareDateOnly(date, this.getMinDate()) >= 0)
            && (DateHelper.compareDateOnly(date, this.getMaxDate()) <= 0)
            && !newDates.stream()
                .anyMatch(newDate -> DateHelper.matchDateOnly(date, newDate))));
  }

  public void doHighlight() {
	  Set<Date> newDates = new TreeSet<>();
	  newDates.addAll(this.dates);
	  this.selectedDates = newDates;
  }
}
