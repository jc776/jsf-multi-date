package com.jc776.eetest;

import java.util.Date;

import org.joda.time.DateTimeComparator;

public class DateHelper {
  public static int compareDateOnly(final Date a, final Date b) {
    final int result;
    if (null == a) {
      if (null == b) {
        result = 0;
      } else {
        result = 1;
      }
    } else {
      if (null == b) {
        result = -1;
      } else {
        result = DateTimeComparator.getDateOnlyInstance().compare(a, b);
      }
    }
    return result;
  }

  public static boolean matchDateOnly(final Date a, final Date b) {
    boolean match;
    if (null == a) {
      if (null == b) {
        match = true;
      } else {
        match = false;
      }
    } else {
      if (null == b) {
        match = false;
      } else {
        match = DateTimeComparator.getDateOnlyInstance().compare(a, b) == 0;
      }
    }
    return match;
  }
}
